import { prisma } from '../lib/prisma.js'
import type { CartWarning } from '../types/cart.js'
import type { CreateOrderRequest } from '../types/order.js'
import { getDayLockKey } from '../utils/dayLock.js'
import { OrderConflictError } from '../utils/orderConflict.js'
import { buildOrderDraft } from '../utils/orderDraft.js'
import { createOrderNumber } from '../utils/orderNumber.js'
import { findCartVariants } from './cartService.js'
import { getDeliveryDates } from './deliveryService.js'
import { getMaxOrdersPerDay, getShippingFeeCents } from './settingsService.js'

type CreateOrderResult =
  | {
      ok: true
      order: { id: number; orderNumber: string; status: string; totalCents: number }
    }
  | { ok: false; reason: 'date_unavailable' | 'pickup_point_unavailable' }
  | { ok: false; reason: 'cart_changed'; warnings: CartWarning[] }

const isDateAvailable = async (date: string, now: Date) => {
  const { days } = await getDeliveryDates(date.slice(0, 7), now)

  return days.some((day) => day.date === date && day.available)
}

const isPickupPointActive = async (id: number) =>
  (await prisma.pickupPoint.findFirst({ where: { id, isActive: true }, select: { id: true } })) !==
  null

const toConflictResult = (error: OrderConflictError): CreateOrderResult =>
  error.reason === 'cart_changed'
    ? { ok: false, reason: 'cart_changed', warnings: error.warnings }
    : { ok: false, reason: error.reason }

export const createOrder = async (
  userId: number,
  request: CreateOrderRequest,
  now: Date,
): Promise<CreateOrderResult> => {
  const { delivery, deliveryDate, idempotencyKey, lines } = request

  if (!(await isDateAvailable(deliveryDate, now))) return { ok: false, reason: 'date_unavailable' }

  if (delivery.method === 'pickup' && !(await isPickupPointActive(delivery.pickupPointId))) {
    return { ok: false, reason: 'pickup_point_unavailable' }
  }

  const [variants, shippingFeeCents, maxOrdersPerDay] = await Promise.all([
    findCartVariants(lines.map((line) => line.variantId)),
    getShippingFeeCents(),
    getMaxOrdersPerDay(),
  ])
  const result = buildOrderDraft(lines, variants, delivery.method, shippingFeeCents)

  if (!result.ok) return { ok: false, reason: 'cart_changed', warnings: result.warnings }

  const { items, subtotalCents, shippingCents, totalCents } = result.draft
  const deliveryDay = new Date(`${deliveryDate}T00:00:00Z`)
  const itemsInLockOrder = [...items].sort((a, b) => a.variantId - b.variantId)

  try {
    const order = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${getDayLockKey(deliveryDate)})`

      const ordersOfDay = await tx.order.count({
        where: { deliveryDate: deliveryDay, status: { not: 'cancelled' } },
      })

      if (ordersOfDay >= maxOrdersPerDay) throw new OrderConflictError('date_unavailable')

      for (const item of itemsInLockOrder) {
        const { count } = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            isActive: true,
            product: { isActive: true },
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        })

        if (count === 0) {
          throw new OrderConflictError('cart_changed', [
            { variantId: item.variantId, type: 'out_of_stock' },
          ])
        }
      }

      return tx.order.create({
        data: {
          orderNumber: createOrderNumber(now),
          idempotencyKey,
          userId,
          deliveryMethod: delivery.method,
          deliveryDate: deliveryDay,
          ...(delivery.method === 'pickup'
            ? { pickupPointId: delivery.pickupPointId }
            : {
                shippingAddress: delivery.address.address,
                shippingCity: delivery.address.city,
                shippingPostalCode: delivery.address.postalCode,
              }),
          subtotalCents,
          shippingCents,
          totalCents,
          items: { create: items },
          statusHistory: { create: { toStatus: 'pending', changedBy: userId } },
        },
        select: { id: true, orderNumber: true, status: true, totalCents: true },
      })
    })

    return { ok: true, order }
  } catch (error) {
    if (error instanceof OrderConflictError) return toConflictResult(error)

    throw error
  }
}

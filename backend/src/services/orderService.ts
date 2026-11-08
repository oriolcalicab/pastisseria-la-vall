import type { Prisma } from '../generated/prisma/client.js'
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
import { isUniqueConstraintError } from './userService.js'
import { toDateKey } from '../utils/dateKey.js'

type OrderSummary = { id: number; orderNumber: string; status: string; totalCents: number }

type CreateOrderResult =
  | { ok: true; order: OrderSummary; isNew: boolean }
  | { ok: false; reason: 'date_unavailable' | 'pickup_point_unavailable' }
  | { ok: false; reason: 'cart_changed'; warnings: CartWarning[] }

const isDateAvailable = async (date: string, now: Date) => {
  const { days } = await getDeliveryDates(date.slice(0, 7), now)

  return days.some((day) => day.date === date && day.available)
}

const isPickupPointActive = async (id: number) =>
  (await prisma.pickupPoint.findFirst({ where: { id, isActive: true }, select: { id: true } })) !==
  null

const orderSummarySelect = { id: true, orderNumber: true, status: true, totalCents: true } as const

const findExistingOrder = (userId: number, idempotencyKey: string) =>
  prisma.order.findUnique({
    where: { userId_idempotencyKey: { userId, idempotencyKey } },
    select: orderSummarySelect,
  })

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
  const existingOrder = await findExistingOrder(userId, idempotencyKey)

  if (existingOrder) return { ok: true, order: existingOrder, isNew: false }

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
        select: orderSummarySelect,
      })
    })

    return { ok: true, order, isNew: true }
  } catch (error) {
    if (error instanceof OrderConflictError) return toConflictResult(error)

    if (isUniqueConstraintError(error)) {
      const duplicatedOrder = await findExistingOrder(userId, idempotencyKey)

      if (duplicatedOrder) return { ok: true, order: duplicatedOrder, isNew: false }
    }

    throw error
  }
}

const orderDetailSelect = {
  id: true,
  orderNumber: true,
  status: true,
  deliveryMethod: true,
  deliveryDate: true,
  shippingAddress: true,
  shippingCity: true,
  shippingPostalCode: true,
  subtotalCents: true,
  shippingCents: true,
  totalCents: true,
  createdAt: true,
  pickupPoint: { select: { name: true, address: true, city: true, openingHours: true } },
  items: {
    orderBy: { id: 'asc' },
    select: {
      id: true,
      productName: true,
      variantName: true,
      unitPriceCents: true,
      quantity: true,
      lineTotalCents: true,
    },
  },
} satisfies Prisma.OrderSelect

export const getCustomerOrder = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: orderDetailSelect,
  })

  if (!order) return null

  return { ...order, deliveryDate: toDateKey(order.deliveryDate) }
}

const orderListSelect = {
  id: true,
  orderNumber: true,
  status: true,
  deliveryMethod: true,
  deliveryDate: true,
  totalCents: true,
  createdAt: true,
} satisfies Prisma.OrderSelect

export const listCustomerOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: orderListSelect,
  })

  return orders.map((order) => ({ ...order, deliveryDate: toDateKey(order.deliveryDate) }))
}

import { prisma } from '../lib/prisma.js'
import type { CartWarning } from '../types/cart.js'
import type { CreateOrderRequest } from '../types/order.js'
import { buildOrderDraft } from '../utils/orderDraft.js'
import { createOrderNumber } from '../utils/orderNumber.js'
import { findCartVariants } from './cartService.js'
import { getDeliveryDates } from './deliveryService.js'
import { getShippingFeeCents } from './settingsService.js'

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

  const [variants, shippingFeeCents] = await Promise.all([
    findCartVariants(lines.map((line) => line.variantId)),
    getShippingFeeCents(),
  ])
  const result = buildOrderDraft(lines, variants, delivery.method, shippingFeeCents)

  if (!result.ok) return { ok: false, reason: 'cart_changed', warnings: result.warnings }

  const { items, subtotalCents, shippingCents, totalCents } = result.draft

  const order = await prisma.order.create({
    data: {
      orderNumber: createOrderNumber(now),
      idempotencyKey,
      userId,
      deliveryMethod: delivery.method,
      deliveryDate: new Date(`${deliveryDate}T00:00:00Z`),
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

  return { ok: true, order }
}

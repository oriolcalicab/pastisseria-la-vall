import type { DeliveryMethod } from '../types/checkout'

export type OrderTotals = {
  subtotalCents: number
  shippingCents: number
  totalCents: number
}

export const getOrderTotals = (
  subtotalCents: number,
  method: DeliveryMethod,
  shippingFeeCents: number,
): OrderTotals => {
  const shippingCents = method === 'delivery' ? shippingFeeCents : 0

  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents }
}
import type { RequestedCartLine } from './cart.js'

export type ShippingAddress = {
  address: string
  city: string
  postalCode: string
}

export type OrderDelivery =
  { method: 'delivery'; address: ShippingAddress } | { method: 'pickup'; pickupPointId: number }

export type CreateOrderRequest = {
  idempotencyKey: string
  deliveryDate: string
  delivery: OrderDelivery
  lines: RequestedCartLine[]
}

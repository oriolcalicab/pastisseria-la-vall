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

export type OrderItemDraft = {
  variantId: number
  productName: string
  variantName: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export type OrderDraft = {
  items: OrderItemDraft[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
}

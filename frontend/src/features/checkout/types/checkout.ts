export type DeliveryMethod = 'delivery' | 'pickup'

export type ShippingAddress = {
  address: string
  city: string
  postalCode: string
}

export type ShippingAddressErrors = Partial<Record<keyof ShippingAddress, string>>

export type OrderLinePayload = {
  variantId: number
  quantity: number
  priceCents: number
}

export type OrderPayload = {
  idempotencyKey: string
  deliveryDate: string
  deliveryMethod: DeliveryMethod
  pickupPointId?: number
  shippingAddress?: ShippingAddress
  lines: OrderLinePayload[]
}

export type CreatedOrder = {
  id: number
  orderNumber: string
  status: string
  totalCents: number
}

export type OrderConflictReason = 'date_unavailable' | 'pickup_point_unavailable' | 'cart_changed'

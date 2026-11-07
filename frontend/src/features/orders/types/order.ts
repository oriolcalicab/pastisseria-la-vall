import type { DeliveryMethod } from '../../checkout/types/checkout'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export type OrderItem = {
  id: number
  productName: string
  variantName: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export type OrderPickupPoint = {
  name: string
  address: string
  city: string
  openingHours: string
}

export type OrderDetail = {
  id: number
  orderNumber: string
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  deliveryDate: string
  shippingAddress: string | null
  shippingCity: string | null
  shippingPostalCode: string | null
  subtotalCents: number
  shippingCents: number
  totalCents: number
  createdAt: string
  pickupPoint: OrderPickupPoint | null
  items: OrderItem[]
}

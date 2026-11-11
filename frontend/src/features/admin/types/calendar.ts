import type { DeliveryMethod } from '../../checkout/types/checkout'
import type { OrderStatus } from '../../orders/types/order'

export type CalendarRange = {
  from: string
  to: string
}

export type CalendarOrder = {
  id: number
  orderNumber: string
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  deliveryDate: string
  user: { name: string }
}

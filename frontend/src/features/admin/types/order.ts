import type { OrderStatus, OrderSummary, OrderDetail } from '../../orders/types/order'

export type AdminOrderSummary = OrderSummary & {
  user: { name: string; email: string }
}

export type AdminOrderPage = {
  items: AdminOrderSummary[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type StatusFilter = OrderStatus | ''

export type AdminOrderDetail = OrderDetail & {
  user: { name: string; email: string }
}

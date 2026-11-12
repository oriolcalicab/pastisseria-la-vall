import type { DeliveryMethod } from '../../checkout/types/checkout'
import type { OrderStatus } from '../../orders/types/order'

export type StatsRange = {
  from: string
  to: string
}

export type RangePreset = 'last7' | 'last30' | 'thisMonth' | 'custom'

export type DailySales = {
  date: string
  orders: number
  revenueCents: number
}

export type TopProduct = {
  productName: string
  quantity: number
  revenueCents: number
}

export type AdminStats = StatsRange & {
  revenueCents: number
  orderCount: number
  ordersByStatus: Record<OrderStatus, number>
  ordersByMethod: Record<DeliveryMethod, number>
  topProducts: TopProduct[]
  salesByDay: DailySales[]
}

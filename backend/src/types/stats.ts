import type { DeliveryMethod, OrderStatus } from '../generated/prisma/enums.js'

export type StatsQuery = {
  from: string
  to: string
}

export type SoldOrder = {
  createdAt: Date
  totalCents: number
}

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

export type AdminStats = StatsQuery & {
  revenueCents: number
  orderCount: number
  ordersByStatus: Record<OrderStatus, number>
  ordersByMethod: Record<DeliveryMethod, number>
  topProducts: TopProduct[]
  salesByDay: DailySales[]
}

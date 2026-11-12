import type { AdminStats } from '../types/stats'

export const averageOrderCents = ({ revenueCents, orderCount }: AdminStats): number =>
  orderCount === 0 ? 0 : Math.round(revenueCents / orderCount)

export const totalOrders = ({ ordersByStatus }: AdminStats): number =>
  Object.values(ordersByStatus).reduce((total, count) => total + count, 0)

export const percentOf = (part: number, total: number): number =>
  total === 0 ? 0 : Math.round((part / total) * 100)

import { prisma } from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'
import { DeliveryMethod, OrderStatus } from '../generated/prisma/enums.js'
import type { AdminStats, StatsQuery } from '../types/stats.js'
import { salesByDay } from '../utils/salesByDay.js'

const TOP_PRODUCTS = 5
const DAY_MS = 24 * 60 * 60 * 1000

const zeroCounts = <Key extends string>(keys: Record<Key, Key>) =>
  Object.fromEntries(Object.values<Key>(keys).map((key) => [key, 0])) as Record<Key, number>

const createdInPeriod = ({ from, to }: StatsQuery): Prisma.OrderWhereInput => ({
  createdAt: {
    gte: new Date(`${from}T00:00:00Z`),
    lt: new Date(Date.parse(`${to}T00:00:00Z`) + DAY_MS),
  },
})

export const getAdminStats = async (query: StatsQuery): Promise<AdminStats> => {
  const period = createdInPeriod(query)
  const sold: Prisma.OrderWhereInput = { ...period, status: { not: OrderStatus.cancelled } }

  const [byStatus, byMethod, products, orders] = await Promise.all([
    prisma.order.groupBy({ by: ['status'], where: period, _count: { _all: true } }),
    prisma.order.groupBy({ by: ['deliveryMethod'], where: sold, _count: { _all: true } }),
    prisma.orderItem.groupBy({
      by: ['productName'],
      where: { order: sold },
      _sum: { quantity: true, lineTotalCents: true },
      orderBy: [{ _sum: { quantity: 'desc' } }, { productName: 'asc' }],
      take: TOP_PRODUCTS,
    }),
    prisma.order.findMany({ where: sold, select: { createdAt: true, totalCents: true } }),
  ])

  const ordersByStatus = zeroCounts(OrderStatus)
  byStatus.forEach((row) => {
    ordersByStatus[row.status] = row._count._all
  })

  const ordersByMethod = zeroCounts(DeliveryMethod)
  byMethod.forEach((row) => {
    ordersByMethod[row.deliveryMethod] = row._count._all
  })

  return {
    ...query,
    revenueCents: orders.reduce((total, order) => total + order.totalCents, 0),
    orderCount: orders.length,
    ordersByStatus,
    ordersByMethod,
    topProducts: products.map((row) => ({
      productName: row.productName,
      quantity: row._sum.quantity ?? 0,
      revenueCents: row._sum.lineTotalCents ?? 0,
    })),
    salesByDay: salesByDay(orders, query.from, query.to),
  }
}

import { prisma } from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { AdminOrderListQuery } from '../types/order.js'
import { toDateKey } from '../utils/dateKey.js'
import { orderDetailSelect, orderListSelect } from './orderService.js'

const customerSelect = { select: { name: true, email: true } } as const

export const listAdminOrders = async ({ page, pageSize, status }: AdminOrderListQuery) => {
  const where: Prisma.OrderWhereInput = status ? { status } : {}

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      select: { ...orderListSelect, user: customerSelect },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ])

  return {
    items: orders.map((order) => ({ ...order, deliveryDate: toDateKey(order.deliveryDate) })),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export const getAdminOrder = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: { ...orderDetailSelect, user: customerSelect },
  })

  if (!order) return null

  return { ...order, deliveryDate: toDateKey(order.deliveryDate) }
}

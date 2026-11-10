import { prisma } from '../lib/prisma.js'
import type { Prisma } from '../generated/prisma/client.js'
import type { AdminOrderListQuery, CalendarQuery } from '../types/order.js'
import { toDateKey } from '../utils/dateKey.js'
import { orderDetailSelect, orderListSelect } from './orderService.js'
import type { OrderStatus } from '../generated/prisma/enums.js'
import { canChangeStatus, orderTransitions } from '../utils/orderStatus.js'

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

  return {
    ...order,
    deliveryDate: toDateKey(order.deliveryDate),
    allowedStatuses: orderTransitions[order.status],
  }
}

type AdminOrder = NonNullable<Awaited<ReturnType<typeof getAdminOrder>>>

type StatusChangeFailure =
  | { ok: false; reason: 'not_found' }
  | { ok: false; reason: 'invalid_transition'; from: OrderStatus }

export type ChangeStatusResult = { ok: true; order: AdminOrder } | StatusChangeFailure

export const changeOrderStatus = async (
  orderId: number,
  toStatus: OrderStatus,
  adminId: number,
): Promise<ChangeStatusResult> => {
  const change = await prisma.$transaction(
    async (tx): Promise<{ ok: true } | StatusChangeFailure> => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true, items: { select: { variantId: true, quantity: true } } },
      })

      if (!order) return { ok: false, reason: 'not_found' }

      if (!canChangeStatus(order.status, toStatus)) {
        return { ok: false, reason: 'invalid_transition', from: order.status }
      }

      const { count } = await tx.order.updateMany({
        where: { id: orderId, status: order.status },
        data: { status: toStatus },
      })

      if (count === 0) return { ok: false, reason: 'invalid_transition', from: order.status }

      await tx.orderStatusHistory.create({
        data: { orderId, fromStatus: order.status, toStatus, changedBy: adminId },
      })

      if (toStatus === 'cancelled') {
        const itemsInLockOrder = [...order.items].sort((a, b) => a.variantId - b.variantId)

        for (const item of itemsInLockOrder) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          })
        }
      }

      return { ok: true }
    },
  )

  if (!change.ok) return change

  const order = await getAdminOrder(orderId)

  return order ? { ok: true, order } : { ok: false, reason: 'not_found' }
}

export const listCalendarOrders = async ({ from, to }: CalendarQuery) => {
  const orders = await prisma.order.findMany({
    where: {
      status: { not: 'cancelled' },
      deliveryDate: {
        gte: new Date(`${from}T00:00:00Z`),
        lte: new Date(`${to}T00:00:00Z`),
      },
    },
    orderBy: [{ deliveryDate: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      orderNumber: true,
      status: true,
      deliveryMethod: true,
      deliveryDate: true,
      user: { select: { name: true } },
    },
  })

  return orders.map((order) => ({ ...order, deliveryDate: toDateKey(order.deliveryDate) }))
}

import { OrderStatus } from '../generated/prisma/enums.js'

export const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export const canChangeStatus = (from: OrderStatus, to: OrderStatus): boolean =>
  orderTransitions[from].includes(to)

const orderStatuses: string[] = Object.values(OrderStatus)

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === 'string' && orderStatuses.includes(value)

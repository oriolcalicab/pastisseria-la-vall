import type { OrderStatus } from '../../orders/types/order'

export const statusColors: Record<OrderStatus, string> = {
  pending: '#B45309',
  preparing: '#1D4ED8',
  ready: '#15803D',
  delivered: '#4B5563',
  cancelled: '#B91C1C',
}

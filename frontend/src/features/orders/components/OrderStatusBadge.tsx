import type { OrderStatus } from '../types/order'
import { orderStatusLabels } from '../utils/orderLabels'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-200 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

type OrderStatusBadgeProps = {
  status: OrderStatus
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
    {orderStatusLabels[status]}
  </span>
)

export default OrderStatusBadge

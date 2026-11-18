import type { OrderStatus } from '../types/order'
import { orderStatusLabels } from '../utils/orderLabels'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  preparing: 'bg-blue-100 text-blue-900',
  ready: 'bg-green-100 text-green-900',
  delivered: 'bg-nata text-mocha',
  cancelled: 'bg-red-100 text-red-800',
}

type OrderStatusBadgeProps = {
  status: OrderStatus
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
    {orderStatusLabels[status]}
  </span>
)

export default OrderStatusBadge

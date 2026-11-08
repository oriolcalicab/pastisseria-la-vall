import { formatPrice } from '../../../lib/formatPrice'
import { getDayLabel } from '../../delivery/utils/calendar'
import type { OrderSummary } from '../types/order'
import { deliveryMethodLabels, formatOrderDate } from '../utils/orderLabels'
import OrderStatusBadge from './OrderStatusBadge'

type OrdersListProps = {
  orders: OrderSummary[]
}

const OrdersList = ({ orders }: OrdersListProps) => (
  <ul className="mt-6 space-y-4">
    {orders.map((order) => (
      <li key={order.id} className="rounded-sm border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">{order.orderNumber}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-600">Data</dt>
          <dd>{formatOrderDate(order.createdAt)}</dd>
          <dt className="text-gray-600">Entrega</dt>
          <dd>{getDayLabel(order.deliveryDate)}</dd>
          <dt className="text-gray-600">Mètode</dt>
          <dd>{deliveryMethodLabels[order.deliveryMethod]}</dd>
          <dt className="text-gray-600">Total</dt>
          <dd className="font-semibold">{formatPrice(order.totalCents)}</dd>
        </dl>
      </li>
    ))}
  </ul>
)

export default OrdersList

import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { getDayLabel } from '../../delivery/utils/calendar'
import type { OrderSummary } from '../types/order'
import { deliveryMethodLabels, formatOrderDate } from '../utils/orderLabels'
import OrderStatusBadge from './OrderStatusBadge'

type OrdersListProps = {
  orders: OrderSummary[]
}

const OrdersList = ({ orders }: OrdersListProps) => (
  <ul className="mt-8 space-y-4">
    {orders.map((order) => (
      <li key={order.id} className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium">
            <Link to={`/comandes/${order.id}`} className="text-caramel hover:underline">
              {order.orderNumber}
            </Link>
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
          <dt className="text-mocha">Data</dt>
          <dd>{formatOrderDate(order.createdAt)}</dd>
          <dt className="text-mocha">Entrega</dt>
          <dd>{getDayLabel(order.deliveryDate)}</dd>
          <dt className="text-mocha">Mètode</dt>
          <dd>{deliveryMethodLabels[order.deliveryMethod]}</dd>
          <dt className="text-mocha">Total</dt>
          <dd className="font-medium">{formatPrice(order.totalCents)}</dd>
        </dl>
      </li>
    ))}
  </ul>
)

export default OrdersList

import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { formatShortDate } from '../../../lib/formatShortDate'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge'
import { deliveryMethodLabels } from '../../orders/utils/orderLabels'
import type { AdminOrderSummary } from '../types/order'

const columns = ['Número', 'Client', 'Data', 'Entrega', 'Mètode', 'Total', 'Estat']

type AdminOrdersTableProps = {
  orders: AdminOrderSummary[]
}

const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => (
  <div className="overflow-x-auto rounded-2xl border border-line bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-nata text-mocha">
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-3 py-2 font-medium whitespace-nowrap">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t border-line">
            <td className="px-3 py-2 font-medium whitespace-nowrap">
              <Link to={`/admin/comandes/${order.id}`} className="text-caramel hover:underline">
                {order.orderNumber}
              </Link>
            </td>
            <td className="px-3 py-2">
              <span className="block">{order.user.name}</span>
              <span className="block text-xs text-mocha">{order.user.email}</span>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">{formatShortDate(order.createdAt)}</td>
            <td className="px-3 py-2 whitespace-nowrap">{formatShortDate(order.deliveryDate)}</td>
            <td className="px-3 py-2 whitespace-nowrap">
              {deliveryMethodLabels[order.deliveryMethod]}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">{formatPrice(order.totalCents)}</td>
            <td className="px-3 py-2 whitespace-nowrap">
              <OrderStatusBadge status={order.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default AdminOrdersTable

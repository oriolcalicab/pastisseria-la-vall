import { formatPrice } from '../../../lib/formatPrice'
import { getDayLabel } from '../../delivery/utils/calendar'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge'
import { deliveryMethodLabels, formatOrderDate } from '../../orders/utils/orderLabels'
import type { AdminOrderSummary } from '../types/order'

const columns = ['Número', 'Client', 'Data', 'Entrega', 'Mètode', 'Total', 'Estat']

type AdminOrdersTableProps = {
  orders: AdminOrderSummary[]
}

const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => (
  <div className="overflow-x-auto rounded border">
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-4 py-2 font-semibold">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t">
            <td className="px-4 py-2 font-medium whitespace-nowrap">{order.orderNumber}</td>
            <td className="px-4 py-2">
              <span className="block">{order.user.name}</span>
              <span className="block text-gray-600">{order.user.email}</span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap">{formatOrderDate(order.createdAt)}</td>
            <td className="px-4 py-2 whitespace-nowrap">{getDayLabel(order.deliveryDate)}</td>
            <td className="px-4 py-2">{deliveryMethodLabels[order.deliveryMethod]}</td>
            <td className="px-4 py-2 whitespace-nowrap">{formatPrice(order.totalCents)}</td>
            <td className="px-4 py-2">
              <OrderStatusBadge status={order.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default AdminOrdersTable

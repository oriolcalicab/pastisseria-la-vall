import type { OrderStatus } from '../../../orders/types/order'
import { orderStatusLabels } from '../../../orders/utils/orderLabels'
import { useLoadedStats } from '../../hooks/useDashboard'

const statuses = Object.keys(orderStatusLabels) as OrderStatus[]

const OrdersByStatus = () => {
  const { ordersByStatus } = useLoadedStats()

  return (
    <section aria-labelledby="orders-by-status-title" className="card">
      <h2 id="orders-by-status-title" className="font-medium">
        Comandes per estat
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        {statuses.map((status) => (
          <div
            key={status}
            className={`flex justify-between ${status === 'cancelled' ? 'text-mocha' : ''}`}
          >
            <dt>{orderStatusLabels[status]}</dt>
            <dd className="font-medium">{ordersByStatus[status]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default OrdersByStatus

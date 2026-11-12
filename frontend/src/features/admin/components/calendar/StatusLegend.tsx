import type { OrderStatus } from '../../../orders/types/order'
import { orderStatusLabels } from '../../../orders/utils/orderLabels'
import { statusColors } from '../../data/calendarColors'

const statuses = Object.keys(statusColors) as OrderStatus[]

const StatusLegend = () => (
  <ul aria-label="Colors dels estats" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
    {statuses.map((status) => (
      <li key={status} className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-3 rounded-sm"
          style={{ backgroundColor: statusColors[status] }}
        />
        {orderStatusLabels[status]}
      </li>
    ))}
  </ul>
)

export default StatusLegend

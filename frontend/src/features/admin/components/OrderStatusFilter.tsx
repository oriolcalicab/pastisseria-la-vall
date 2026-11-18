import type { OrderStatus } from '../../orders/types/order'
import { orderStatusLabels } from '../../orders/utils/orderLabels'
import type { StatusFilter } from '../types/order'

const statuses = Object.keys(orderStatusLabels) as OrderStatus[]

type OrderStatusFilterProps = {
  value: StatusFilter
  onChange: (value: StatusFilter) => void
}

const OrderStatusFilter = ({ value, onChange }: OrderStatusFilterProps) => (
  <label className="flex items-center gap-2 text-sm text-mocha">
    Estat
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as StatusFilter)}
      className="field mt-0 w-auto"
    >
      <option value="">Tots els estats</option>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {orderStatusLabels[status]}
        </option>
      ))}
    </select>
  </label>
)

export default OrderStatusFilter

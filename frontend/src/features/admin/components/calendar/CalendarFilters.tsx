import type { DeliveryMethod } from '../../../checkout/types/checkout'
import type { OrderStatus } from '../../../orders/types/order'
import { deliveryMethodLabels, orderStatusLabels } from '../../../orders/utils/orderLabels'
import type { CalendarFilters as Filters } from '../../types/calendar'

const statuses = Object.keys(orderStatusLabels) as OrderStatus[]
const methods = Object.keys(deliveryMethodLabels) as DeliveryMethod[]

const selectClassName =
  'mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-chocolate focus-visible:ring-2 focus-visible:ring-caramel focus-visible:outline-none'

type CalendarFiltersProps = {
  value: Filters
  onChange: (filters: Filters) => void
}

const CalendarFilters = ({ value, onChange }: CalendarFiltersProps) => (
  <div className="flex flex-wrap gap-4">
    <label className="text-sm text-mocha">
      Estat
      <select
        value={value.status}
        onChange={(event) =>
          onChange({ ...value, status: event.target.value as Filters['status'] })
        }
        className={selectClassName}
      >
        <option value="">Tots menys les cancel·lades</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {orderStatusLabels[status]}
          </option>
        ))}
      </select>
    </label>

    <label className="text-sm text-mocha">
      Tipus d'entrega
      <select
        value={value.deliveryMethod}
        onChange={(event) =>
          onChange({ ...value, deliveryMethod: event.target.value as Filters['deliveryMethod'] })
        }
        className={selectClassName}
      >
        <option value="">Tots</option>
        {methods.map((method) => (
          <option key={method} value={method}>
            {deliveryMethodLabels[method]}
          </option>
        ))}
      </select>
    </label>
  </div>
)

export default CalendarFilters

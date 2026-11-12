import type { DeliveryMethod } from '../../../checkout/types/checkout'
import { deliveryMethodLabels } from '../../../orders/utils/orderLabels'
import { useLoadedStats } from '../../hooks/useDashboard'
import { percentOf } from '../../utils/statsFigures'

const methods: { method: DeliveryMethod; color: string }[] = [
  { method: 'pickup', color: 'bg-cocoa' },
  { method: 'delivery', color: 'bg-caramel' },
]

const DeliveryMethodsBar = () => {
  const { ordersByMethod } = useLoadedStats()
  const total = ordersByMethod.pickup + ordersByMethod.delivery

  return (
    <section aria-labelledby="delivery-methods-title" className="card">
      <h2 id="delivery-methods-title" className="font-medium">
        Tipus d'entrega
      </h2>

      <div aria-hidden="true" className="mt-4 flex h-3 overflow-hidden rounded-full bg-nata">
        {methods.map(({ method, color }) => (
          <div
            key={method}
            className={color}
            style={{ width: `${percentOf(ordersByMethod[method], total)}%` }}
          />
        ))}
      </div>

      <ul className="mt-3 space-y-1 text-sm">
        {methods.map(({ method, color }) => (
          <li key={method} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2.5 rounded-full ${color}`} />
            {deliveryMethodLabels[method]}: {ordersByMethod[method]} (
            {percentOf(ordersByMethod[method], total)} %)
          </li>
        ))}
      </ul>
    </section>
  )
}

export default DeliveryMethodsBar

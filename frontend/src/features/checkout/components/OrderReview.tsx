import { formatPrice } from '../../../lib/formatPrice'
import type { CartLine } from '../../cart/types/cart'
import { getDayLabel } from '../../delivery/utils/calendar'
import type { PickupPoint } from '../../pickup/types/pickupPoint'
import type { ShippingFeeState } from '../hooks/useShippingFee'
import type { DeliveryMethod, ShippingAddress } from '../types/checkout'
import { getOrderTotals } from '../utils/orderTotals'

type OrderReviewProps = {
  lines: CartLine[]
  subtotalCents: number
  deliveryDate: string
  method: DeliveryMethod
  address: ShippingAddress
  pickupPoint: PickupPoint | null
  shippingFee: ShippingFeeState
}

const OrderReview = ({
  lines,
  subtotalCents,
  deliveryDate,
  method,
  address,
  pickupPoint,
  shippingFee,
}: OrderReviewProps) => {
  const feeCents =
    method === 'pickup' ? 0 : shippingFee.status === 'success' ? shippingFee.feeCents : null
  const totals = feeCents === null ? null : getOrderTotals(subtotalCents, method, feeCents)

  return (
    <div className="mt-6 space-y-4">
      <dl className="card space-y-4">
        <div>
          <dt className="text-sm text-mocha">Data de lliurament</dt>
          <dd className="mt-1 font-medium">{getDayLabel(deliveryDate)}</dd>
        </div>

        {method === 'delivery' && (
          <div>
            <dt className="text-sm text-mocha">Lliurament a domicili</dt>
            <dd className="mt-1">
              {address.address}, {address.postalCode} {address.city}
            </dd>
          </div>
        )}

        {method === 'pickup' && pickupPoint && (
          <div>
            <dt className="text-sm text-mocha">Recollida</dt>
            <dd className="mt-1">
              {pickupPoint.name}, {pickupPoint.address}, {pickupPoint.city}
            </dd>
            <dd className="text-sm text-mocha">{pickupPoint.openingHours}</dd>
          </div>
        )}
      </dl>

      <section aria-labelledby="review-items-title" className="card">
        <h3 id="review-items-title" className="text-2xl">
          Productes
        </h3>
        <ul className="mt-3 divide-y divide-line">
          {lines.map((line) => (
            <li key={line.variantId} className="flex justify-between gap-4 py-2">
              <span>
                {line.quantity} × {line.productName} ({line.variantName})
              </span>
              <span className="whitespace-nowrap">
                {formatPrice(line.priceCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-2 space-y-2 border-t border-line pt-4">
          <div className="flex justify-between gap-4 text-mocha">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-mocha">
            <dt>Enviament</dt>
            <dd>
              {method === 'pickup' && 'Gratuït'}
              {method === 'delivery' && shippingFee.status === 'loading' && 'Calculant...'}
              {method === 'delivery' &&
                shippingFee.status === 'success' &&
                formatPrice(shippingFee.feeCents)}
              {method === 'delivery' && shippingFee.status === 'error' && (
                <button
                  type="button"
                  onClick={shippingFee.retry}
                  className="text-red-700 underline"
                >
                  No s'ha pogut calcular. Torna-ho a provar
                </button>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4 font-display text-2xl">
            <dt>Total</dt>
            <dd>{totals ? formatPrice(totals.totalCents) : '—'}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default OrderReview

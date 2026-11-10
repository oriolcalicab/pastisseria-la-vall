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
    <>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-medium">Data de lliurament</dt>
          <dd>{getDayLabel(deliveryDate)}</dd>
        </div>

        {method === 'delivery' && (
          <div>
            <dt className="font-medium">Lliurament a domicili</dt>
            <dd>
              {address.address}, {address.postalCode} {address.city}
            </dd>
          </div>
        )}

        {method === 'pickup' && pickupPoint && (
          <div>
            <dt className="font-medium">Recollida</dt>
            <dd>
              {pickupPoint.name}, {pickupPoint.address}, {pickupPoint.city}
            </dd>
            <dd className="text-sm text-gray-600">{pickupPoint.openingHours}</dd>
          </div>
        )}
      </dl>

      <h3 className="mt-6 font-semibold">Productes</h3>
      <ul className="mt-2 space-y-1">
        {lines.map((line) => (
          <li key={line.variantId} className="flex justify-between gap-4">
            <span>
              {line.quantity} × {line.productName} ({line.variantName})
            </span>
            <span>{formatPrice(line.priceCents * line.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1 border-t pt-4">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Enviament</dt>
          <dd>
            {method === 'pickup' && 'Gratuït'}
            {method === 'delivery' && shippingFee.status === 'loading' && 'Calculant...'}
            {method === 'delivery' &&
              shippingFee.status === 'success' &&
              formatPrice(shippingFee.feeCents)}
            {method === 'delivery' && shippingFee.status === 'error' && (
              <button type="button" onClick={shippingFee.retry} className="text-red-600 underline">
                No s'ha pogut calcular. Torna-ho a provar
              </button>
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-lg font-bold">
          <dt>Total</dt>
          <dd>{totals ? formatPrice(totals.totalCents) : '—'}</dd>
        </div>
      </dl>
    </>
  )
}

export default OrderReview

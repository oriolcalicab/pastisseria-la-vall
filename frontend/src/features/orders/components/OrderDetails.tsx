import { formatPrice } from '../../../lib/formatPrice'
import { getDayLabel } from '../../delivery/utils/calendar'
import type { OrderDetail } from '../types/order'

type OrderDetailsProps = {
  order: OrderDetail
}

const OrderDetails = ({ order }: OrderDetailsProps) => (
  <div className="mt-8 space-y-4">
    <section aria-labelledby="delivery-title" className="card">
      <h2 id="delivery-title" className="text-2xl">
        Lliurament
      </h2>
      <p className="mt-3">{getDayLabel(order.deliveryDate)}</p>
      {order.deliveryMethod === 'delivery' && (
        <p className="mt-1">
          A domicili: {order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}
        </p>
      )}
      {order.deliveryMethod === 'pickup' && order.pickupPoint && (
        <>
          <p className="mt-1">
            Recollida a {order.pickupPoint.name} ({order.pickupPoint.address})
          </p>
          <p className="mt-1 text-sm text-mocha">{order.pickupPoint.openingHours}</p>
        </>
      )}
    </section>

    <section aria-labelledby="items-title" className="card">
      <h2 id="items-title" className="text-2xl">
        Productes
      </h2>
      <ul className="mt-3 divide-y divide-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-3">
            <div>
              <span>
                {item.quantity} × {item.productName} ({item.variantName})
              </span>
              <span className="block text-sm text-mocha">
                {formatPrice(item.unitPriceCents)} / unitat
              </span>
            </div>
            <span className="whitespace-nowrap">{formatPrice(item.lineTotalCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2 border-t border-line pt-4">
        <div className="flex justify-between text-mocha">
          <dt>Subtotal</dt>
          <dd>{formatPrice(order.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between text-mocha">
          <dt>Enviament</dt>
          <dd>{order.shippingCents === 0 ? 'Gratuït' : formatPrice(order.shippingCents)}</dd>
        </div>
        <div className="flex justify-between font-display text-2xl">
          <dt>Total</dt>
          <dd>{formatPrice(order.totalCents)}</dd>
        </div>
      </dl>
    </section>
  </div>
)

export default OrderDetails

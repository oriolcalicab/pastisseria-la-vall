import { formatPrice } from '../../../lib/formatPrice'
import { getDayLabel } from '../../delivery/utils/calendar'
import type { OrderDetail } from '../types/order'

type OrderDetailsProps = {
  order: OrderDetail
}

const OrderDetails = ({ order }: OrderDetailsProps) => (
  <>
    <section aria-labelledby="delivery-title" className="mt-6">
      <h2 id="delivery-title" className="text-xl font-semibold">
        Lliurament
      </h2>
      <p className="mt-2">{getDayLabel(order.deliveryDate)}</p>
      {order.deliveryMethod === 'delivery' && (
        <p>
          A domicili: {order.shippingAddress}, {order.shippingPostalCode} {order.shippingCity}
        </p>
      )}
      {order.deliveryMethod === 'pickup' && order.pickupPoint && (
        <>
          <p>
            Recollida a {order.pickupPoint.name} ({order.pickupPoint.address})
          </p>
          <p className="text-sm text-gray-600">{order.pickupPoint.openingHours}</p>
        </>
      )}
    </section>

    <section aria-labelledby="items-title" className="mt-6">
      <h2 id="items-title" className="text-xl font-semibold">
        Productes
      </h2>
      <ul className="mt-2 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <div>
              <span>
                {item.quantity} × {item.productName} ({item.variantName})
              </span>
              <span className="block text-sm text-gray-600">
                {formatPrice(item.unitPriceCents)} / unitat
              </span>
            </div>
            <span>{formatPrice(item.lineTotalCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1 border-t pt-2">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(order.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Enviament</dt>
          <dd>{order.shippingCents === 0 ? 'Gratuït' : formatPrice(order.shippingCents)}</dd>
        </div>
        <div className="flex justify-between font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(order.totalCents)}</dd>
        </div>
      </dl>
    </section>
  </>
)

export default OrderDetails

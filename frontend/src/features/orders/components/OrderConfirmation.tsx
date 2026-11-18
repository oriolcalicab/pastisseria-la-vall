import type { OrderDetail } from '../types/order'
import OrderDetails from './OrderDetails'

type OrderConfirmationProps = {
  order: OrderDetail
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => (
  <>
    <div className="rounded-3xl bg-nata px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-cocoa text-2xl text-white"
      >
        ✓
      </span>
      <h1 className="page-title mt-5 font-display">Comanda confirmada</h1>
      <p className="mt-3 text-mocha">
        Número de comanda: <strong className="text-chocolate">{order.orderNumber}</strong>
      </p>
      <p className="mt-1 text-sm text-mocha">
        Gràcies! Ja ens hem posat a pensar en el teu pastís.
      </p>
    </div>
    <OrderDetails order={order} />
  </>
)

export default OrderConfirmation

import type { OrderDetail } from '../types/order'
import OrderDetails from './OrderDetails'

type OrderConfirmationProps = {
  order: OrderDetail
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => (
  <>
    <div className="rounded-sm border border-green-300 bg-green-50 p-4">
      <h1 className="text-2xl font-bold text-green-800">Comanda confirmada</h1>
      <p className="mt-1">
        Número de comanda: <strong>{order.orderNumber}</strong>
      </p>
    </div>
    <OrderDetails order={order} />
  </>
)

export default OrderConfirmation

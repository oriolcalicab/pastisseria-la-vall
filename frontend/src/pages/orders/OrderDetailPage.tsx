import { Link, useParams } from 'react-router-dom'
import OrderDetails from '../../features/orders/components/OrderDetails'
import OrderStatusBadge from '../../features/orders/components/OrderStatusBadge'
import { useOrder } from '../../features/orders/hooks/useOrder'
import { formatOrderDate } from '../../features/orders/utils/orderLabels'
import NotFoundPage from '../errors/NotFoundPage'

const OrderDetailPage = () => {
  const { id = '' } = useParams()
  const order = useOrder(id)

  if (order.status === 'not-found') return <NotFoundPage />

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <Link to="/comandes" className="text-sm underline">
        « Torna a les meves comandes
      </Link>

      {order.status === 'loading' && (
        <p role="status" className="mt-6">
          Carregant la comanda...
        </p>
      )}

      {order.status === 'error' && (
        <div role="alert" className="mt-6">
          <p className="text-red-600">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="mt-2 rounded-sm border px-3 py-1">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">Comanda {order.order.orderNumber}</h1>
            <OrderStatusBadge status={order.order.status} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Feta el {formatOrderDate(order.order.createdAt)}
          </p>
          <OrderDetails order={order.order} />
        </>
      )}
    </main>
  )
}

export default OrderDetailPage

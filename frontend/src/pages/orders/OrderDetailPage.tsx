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
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link to="/comandes" className="text-sm text-caramel hover:underline">
        « Torna a les meves comandes
      </Link>

      {order.status === 'loading' && (
        <p role="status" className="mt-8 text-mocha">
          Carregant la comanda...
        </p>
      )}

      {order.status === 'error' && (
        <div role="alert" className="mt-8">
          <p className="text-red-700">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="btn btn-outline btn-sm mt-3">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h1 className="font-display text-4xl leading-tight">
              Comanda {order.order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.order.status} />
          </div>
          <p className="mt-2 text-mocha">Feta el {formatOrderDate(order.order.createdAt)}</p>
          <OrderDetails order={order.order} />
        </>
      )}
    </main>
  )
}

export default OrderDetailPage

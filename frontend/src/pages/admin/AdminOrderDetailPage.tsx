import { Link, useParams } from 'react-router-dom'
import { useAdminOrder } from '../../features/admin/hooks/useAdminOrder'
import { getMapSearchUrl } from '../../features/admin/utils/mapLinks'
import OrderDetails from '../../features/orders/components/OrderDetails'
import OrderStatusBadge from '../../features/orders/components/OrderStatusBadge'
import { formatOrderDate } from '../../features/orders/utils/orderLabels'
import NotFoundPage from '../errors/NotFoundPage'
import OrderStatusActions from '../../features/admin/components/OrderStatusActions'

const AdminOrderDetailPage = () => {
  const { id = '' } = useParams()
  const order = useAdminOrder(id)

  if (order.status === 'not-found') return <NotFoundPage />

  return (
    <>
      <Link to="/admin/comandes" className="text-sm underline">
        « Torna a les comandes
      </Link>

      {order.status === 'loading' && (
        <p role="status" className="mt-6">
          Carregant la comanda...
        </p>
      )}

      {order.status === 'error' && (
        <div role="alert" className="mt-6">
          <p className="text-red-600">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="mt-2 rounded border px-3 py-1">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && (
        <div className="max-w-3xl">
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">Comanda {order.order.orderNumber}</h1>
            <OrderStatusBadge status={order.order.status} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Feta el {formatOrderDate(order.order.createdAt)}
          </p>

          <OrderStatusActions
            order={order.order}
            onChange={order.replaceOrder}
            onConflict={order.retry}
          />

          <section aria-labelledby="customer-title" className="mt-6">
            <h2 id="customer-title" className="text-xl font-semibold">
              Client
            </h2>
            <p className="mt-2">{order.order.user.name}</p>
            <a href={`mailto:${order.order.user.email}`} className="underline">
              {order.order.user.email}
            </a>
          </section>

          <OrderDetails order={order.order} />

          {order.order.deliveryMethod === 'delivery' && (
            <a
              href={getMapSearchUrl({
                address: order.order.shippingAddress ?? '',
                postalCode: order.order.shippingPostalCode ?? '',
                city: order.order.shippingCity ?? '',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block underline"
            >
              Veure l'adreça al mapa (s'obre en una pestanya nova)
            </a>
          )}
        </div>
      )}
    </>
  )
}

export default AdminOrderDetailPage

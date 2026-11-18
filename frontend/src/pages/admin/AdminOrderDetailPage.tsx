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
      <Link to="/admin/comandes" className="link text-sm">
        « Torna a les comandes
      </Link>

      {order.status === 'loading' && (
        <p role="status" className="mt-6 text-mocha">
          Carregant la comanda...
        </p>
      )}

      {order.status === 'error' && (
        <div role="alert" className="mt-6">
          <p className="text-red-700">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="btn btn-outline btn-sm mt-3">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && (
        <div className="max-w-3xl">
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl leading-tight">
              Comanda {order.order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.order.status} />
          </div>
          <p className="mt-2 text-mocha">Feta el {formatOrderDate(order.order.createdAt)}</p>

          <OrderStatusActions
            order={order.order}
            onChange={order.replaceOrder}
            onConflict={order.retry}
          />

          <section aria-labelledby="customer-title" className="card mt-6">
            <h2 id="customer-title" className="text-2xl">
              Client
            </h2>
            <p className="mt-2">{order.order.user.name}</p>
            <a href={`mailto:${order.order.user.email}`} className="link">
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
              className="link mt-4 inline-block"
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

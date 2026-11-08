import { Link } from 'react-router-dom'
import OrdersList from '../../features/orders/components/OrdersList'
import { useOrders } from '../../features/orders/hooks/useOrders'

const OrdersPage = () => {
  const orders = useOrders()

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Les meves comandes</h1>

      {orders.status === 'loading' && (
        <p role="status" className="mt-6">
          Carregant les comandes...
        </p>
      )}

      {orders.status === 'error' && (
        <div role="alert" className="mt-6">
          <p className="text-red-600">No s'han pogut carregar les comandes.</p>
          <button type="button" onClick={orders.retry} className="mt-2 rounded-sm border px-3 py-1">
            Torna-ho a provar
          </button>
        </div>
      )}

      {orders.status === 'success' && orders.orders.length === 0 && (
        <div className="mt-6">
          <p>Encara no has fet cap comanda.</p>
          <Link to="/productes" className="mt-2 inline-block underline">
            Mira els productes
          </Link>
        </div>
      )}

      {orders.status === 'success' && orders.orders.length > 0 && (
        <OrdersList orders={orders.orders} />
      )}
    </main>
  )
}

export default OrdersPage

import { Link } from 'react-router-dom'
import OrdersList from '../../features/orders/components/OrdersList'
import { useOrders } from '../../features/orders/hooks/useOrders'

const OrdersPage = () => {
  const orders = useOrders()

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="eyebrow">El meu compte</p>
      <h1 className="page-title mt-2 font-display">Les meves comandes</h1>

      {orders.status === 'loading' && (
        <p role="status" className="mt-8 text-mocha">
          Carregant les comandes...
        </p>
      )}

      {orders.status === 'error' && (
        <div role="alert" className="mt-8">
          <p className="text-red-700">No s'han pogut carregar les comandes.</p>
          <button type="button" onClick={orders.retry} className="btn btn-outline btn-sm mt-3">
            Torna-ho a provar
          </button>
        </div>
      )}

      {orders.status === 'success' && orders.orders.length === 0 && (
        <div className="card mt-8 text-center">
          <p className="text-lg">Encara no has fet cap comanda.</p>
          <Link to="/productes" className="btn btn-primary mt-5">
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

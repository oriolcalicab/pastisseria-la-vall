import { Link, useParams } from 'react-router-dom'
import OrderConfirmation from '../../features/orders/components/OrderConfirmation'
import { useOrder } from '../../features/orders/hooks/useOrder'
import NotFoundPage from '../errors/NotFoundPage'

const ConfirmationPage = () => {
  const { id = '' } = useParams()
  const order = useOrder(id)

  if (order.status === 'not-found') return <NotFoundPage />

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      {order.status === 'loading' && <p role="status">Carregant la comanda...</p>}

      {order.status === 'error' && (
        <div role="alert">
          <p className="text-red-600">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="mt-2 rounded-sm border px-3 py-1">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && <OrderConfirmation order={order.order} />}

      <Link to="/productes" className="mt-8 inline-block underline">
        Continua comprant
      </Link>
    </main>
  )
}

export default ConfirmationPage

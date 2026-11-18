import { Link, useParams } from 'react-router-dom'
import OrderConfirmation from '../../features/orders/components/OrderConfirmation'
import { useOrder } from '../../features/orders/hooks/useOrder'
import NotFoundPage from '../errors/NotFoundPage'

const ConfirmationPage = () => {
  const { id = '' } = useParams()
  const order = useOrder(id)

  if (order.status === 'not-found') return <NotFoundPage />

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {order.status === 'loading' && (
        <p role="status" className="text-mocha">
          Carregant la comanda...
        </p>
      )}

      {order.status === 'error' && (
        <div role="alert">
          <p className="text-red-700">No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="btn btn-outline btn-sm mt-3">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && <OrderConfirmation order={order.order} />}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/productes" className="btn btn-primary">
          Continua comprant
        </Link>
        <Link to="/comandes" className="btn btn-outline">
          Les meves comandes
        </Link>
      </div>
    </main>
  )
}

export default ConfirmationPage

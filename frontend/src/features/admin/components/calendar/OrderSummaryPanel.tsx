import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../../../lib/formatPrice'
import OrderStatusBadge from '../../../orders/components/OrderStatusBadge'
import { deliveryMethodLabels, formatOrderDate } from '../../../orders/utils/orderLabels'
import { useAdminOrder } from '../../hooks/useAdminOrder'
import type { AdminOrderDetail } from '../../types/order'
import OrderStatusActions from '../OrderStatusActions'

type OrderSummaryPanelProps = {
  orderId: number
  onClose: () => void
  onStatusChange: () => void
}

const OrderSummaryPanel = ({ orderId, onClose, onStatusChange }: OrderSummaryPanelProps) => {
  const order = useAdminOrder(String(orderId))
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') onClose()
  }

  const handleChange = (updated: AdminOrderDetail) => {
    order.replaceOrder(updated)
    onStatusChange()
  }

  const handleConflict = () => {
    order.retry()
    onStatusChange()
  }

  return (
    <aside aria-labelledby="order-summary-title" onKeyDown={handleKeyDown} className="card">
      <div className="flex items-start justify-between gap-3">
        <h2
          id="order-summary-title"
          ref={titleRef}
          tabIndex={-1}
          className="font-medium focus:outline-none"
        >
          Resum de la comanda
        </h2>
        <button type="button" onClick={onClose} className="text-sm text-caramel hover:underline">
          Tanca
        </button>
      </div>

      {order.status === 'loading' && (
        <p role="status" className="mt-3 text-sm text-mocha">
          Carregant la comanda...
        </p>
      )}

      {(order.status === 'error' || order.status === 'not-found') && (
        <div role="alert" className="mt-3 text-sm">
          <p>No s'ha pogut carregar la comanda.</p>
          <button type="button" onClick={order.retry} className="btn btn-outline btn-sm mt-2">
            Torna-ho a provar
          </button>
        </div>
      )}

      {order.status === 'success' && (
        <>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Comanda</dt>
              <dd>{order.order.orderNumber}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Client</dt>
              <dd>{order.order.user.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Dia</dt>
              <dd>{formatOrderDate(order.order.deliveryDate)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Entrega</dt>
              <dd>{deliveryMethodLabels[order.order.deliveryMethod]}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Total</dt>
              <dd>{formatPrice(order.order.totalCents)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mocha">Estat</dt>
              <dd>
                <OrderStatusBadge status={order.order.status} />
              </dd>
            </div>
          </dl>

          <OrderStatusActions
            order={order.order}
            onChange={handleChange}
            onConflict={handleConflict}
          />

          <Link to={`/admin/comandes/${orderId}`} className="btn btn-outline btn-sm mt-6">
            Veure el detall
          </Link>
        </>
      )}
    </aside>
  )
}

export default OrderSummaryPanel

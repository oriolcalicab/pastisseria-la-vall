import type { OrderStatus } from '../../orders/types/order'
import { orderStatusLabels } from '../../orders/utils/orderLabels'
import { useChangeOrderStatus } from '../hooks/useChangeOrderStatus'
import type { AdminOrderDetail } from '../types/order'

const CANCEL_CONFIRMATION =
  "Segur que vols cancel·lar aquesta comanda? L'stock es tornarà i no es pot desfer."

const actionLabel = (status: OrderStatus) =>
  status === 'cancelled' ? 'Cancel·la la comanda' : `Passa a ${orderStatusLabels[status]}`

type OrderStatusActionsProps = {
  order: AdminOrderDetail
  onChange: (order: AdminOrderDetail) => void
  onConflict: () => void
}

const OrderStatusActions = ({ order, onChange, onConflict }: OrderStatusActionsProps) => {
  const { pendingStatus, error, notice, changeStatus } = useChangeOrderStatus(order.id, {
    onChange,
    onConflict,
  })

  if (order.allowedStatuses.length === 0 && !error && !notice) return null

  const handleClick = (status: OrderStatus) => {
    if (status === 'cancelled' && !window.confirm(CANCEL_CONFIRMATION)) return

    void changeStatus(status)
  }

  return (
    <section aria-labelledby="status-actions-title" className="card mt-6">
      <h2 id="status-actions-title" className="text-2xl">
        Canviar l'estat
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {order.allowedStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleClick(status)}
            disabled={pendingStatus !== null}
            className={`btn btn-sm ${status === 'cancelled' ? 'btn-danger' : 'btn-primary'}`}
          >
            {pendingStatus === status ? 'Desant...' : actionLabel(status)}
          </button>
        ))}
      </div>
      {notice && (
        <p role="status" className="mt-3 text-sm text-green-800">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  )
}

export default OrderStatusActions

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
    <section aria-labelledby="status-actions-title" className="mt-6">
      <h2 id="status-actions-title" className="text-xl font-semibold">
        Canviar l'estat
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {order.allowedStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => handleClick(status)}
            disabled={pendingStatus !== null}
            className={
              status === 'cancelled'
                ? 'rounded border border-red-700 px-3 py-1 text-red-700 disabled:opacity-50'
                : 'rounded bg-gray-900 px-3 py-1 text-white disabled:opacity-50'
            }
          >
            {pendingStatus === status ? 'Desant...' : actionLabel(status)}
          </button>
        ))}
      </div>
      {notice && (
        <p role="status" className="mt-2 text-sm text-green-800">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  )
}

export default OrderStatusActions

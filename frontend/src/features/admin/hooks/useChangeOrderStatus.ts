import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import type { OrderStatus } from '../../orders/types/order'
import { orderStatusLabels } from '../../orders/utils/orderLabels'
import { changeAdminOrderStatus, OrderStatusConflictError } from '../services/adminOrdersApi'
import type { AdminOrderDetail } from '../types/order'

type ChangeOrderStatusOptions = {
  onChange: (order: AdminOrderDetail) => void
  onConflict: () => void
}

export const useChangeOrderStatus = (
  orderId: number,
  { onChange, onConflict }: ChangeOrderStatusOptions,
) => {
  const { user } = useAuth()
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const changeStatus = async (status: OrderStatus) => {
    if (!user || pendingStatus) return

    setPendingStatus(status)
    setError(null)
    setNotice(null)

    try {
      onChange(await changeAdminOrderStatus(await user.getIdToken(), orderId, status))
      setNotice(`Estat canviat a ${orderStatusLabels[status]}.`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No s'ha pogut canviar l'estat")

      if (caught instanceof OrderStatusConflictError) onConflict()
    } finally {
      setPendingStatus(null)
    }
  }

  return { pendingStatus, error, notice, changeStatus }
}

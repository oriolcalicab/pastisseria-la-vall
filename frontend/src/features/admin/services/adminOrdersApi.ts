import { apiUrl } from '../../../lib/api'
import type { OrderStatus } from '../../orders/types/order'
import type { AdminOrderDetail, AdminOrderPage, StatusFilter } from '../types/order'
import type { CalendarFilters, CalendarOrder, CalendarRange } from '../types/calendar'

type AdminOrdersParams = {
  page: number
  status: StatusFilter
}

export const fetchAdminOrders = async (
  token: string,
  { page, status }: AdminOrdersParams,
): Promise<AdminOrderPage> => {
  const params = new URLSearchParams({ page: String(page) })

  if (status) params.set('status', status)

  const response = await fetch(apiUrl(`/api/admin/orders?${params}`), {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    throw new Error("No s'han pogut carregar les comandes")
  })

  if (!response.ok) {
    throw new Error(`Admin orders request failed with status ${response.status}`)
  }

  return response.json() as Promise<AdminOrderPage>
}

export const fetchAdminOrder = async (
  token: string,
  id: string,
): Promise<AdminOrderDetail | null> => {
  const response = await fetch(apiUrl(`/api/admin/orders/${encodeURIComponent(id)}`), {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    throw new Error("No s'ha pogut carregar la comanda")
  })

  if (response.status === 400 || response.status === 404) return null

  if (!response.ok) throw new Error(`Admin order request failed with status ${response.status}`)

  return response.json() as Promise<AdminOrderDetail>
}

const CHANGE_STATUS_ERROR = "No s'ha pogut canviar l'estat de la comanda"

export class OrderStatusConflictError extends Error {
  constructor() {
    super("Una altra persona ha canviat aquesta comanda. Ara es mostra l'estat actual.")
    this.name = 'OrderStatusConflictError'
  }
}

export const changeAdminOrderStatus = async (
  token: string,
  id: number,
  status: OrderStatus,
): Promise<AdminOrderDetail> => {
  const response = await fetch(apiUrl(`/api/admin/orders/${id}/status`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  }).catch(() => {
    throw new Error(CHANGE_STATUS_ERROR)
  })

  if (response.status === 409) throw new OrderStatusConflictError()

  if (!response.ok) throw new Error(CHANGE_STATUS_ERROR)

  return response.json() as Promise<AdminOrderDetail>
}

export const fetchCalendarOrders = async (
  token: string,
  { from, to }: CalendarRange,
  { status, deliveryMethod }: CalendarFilters,
): Promise<CalendarOrder[]> => {
  const params = new URLSearchParams({ from, to })

  if (status) params.set('status', status)
  if (deliveryMethod) params.set('deliveryMethod', deliveryMethod)

  const response = await fetch(apiUrl(`/api/admin/orders/calendar?${params}`), {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    throw new Error("No s'ha pogut carregar el calendari")
  })

  if (!response.ok) throw new Error(`Calendar request failed with status ${response.status}`)

  return response.json() as Promise<CalendarOrder[]>
}

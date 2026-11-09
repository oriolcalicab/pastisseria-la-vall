import { apiUrl } from '../../../lib/api'
import type { AdminOrderPage, StatusFilter, AdminOrderDetail } from '../types/order'

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

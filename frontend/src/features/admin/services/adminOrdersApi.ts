import { apiUrl } from '../../../lib/api'
import type { AdminOrderPage, StatusFilter } from '../types/order'

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

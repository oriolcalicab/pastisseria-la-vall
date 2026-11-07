import { apiUrl } from '../../../lib/api'
import type { OrderDetail } from '../types/order'

export const fetchOrder = async (token: string, id: string): Promise<OrderDetail | null> => {
  const response = await fetch(apiUrl(`/api/orders/${encodeURIComponent(id)}`), {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    throw new Error("No s'ha pogut carregar la comanda")
  })

  if (response.status === 400 || response.status === 404) return null

  if (!response.ok) throw new Error(`Order request failed with status ${response.status}`)

  return response.json() as Promise<OrderDetail>
}

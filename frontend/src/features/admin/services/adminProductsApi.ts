import { apiUrl } from '../../../lib/api'
import type { AdminProductPage } from '../types/product'

type AdminProductsParams = {
  page: number
  search: string
}

export const fetchAdminProducts = async (
  token: string,
  { page, search }: AdminProductsParams,
): Promise<AdminProductPage> => {
  const params = new URLSearchParams({ page: String(page) })

  if (search.trim()) params.set('search', search.trim())

  const response = await fetch(apiUrl(`/api/admin/products?${params}`), {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Admin products request failed with status ${response.status}`)
  }

  return response.json() as Promise<AdminProductPage>
}
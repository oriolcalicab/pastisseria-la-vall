import { apiUrl } from '../../../lib/api'
import type { AdminProduct, AdminProductPage, NewProduct } from '../types/product'

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

const CREATE_PRODUCT_ERROR = "No s'ha pogut crear el producte"

const readErrorMessage = async (response: Response): Promise<string> => {
  const body: unknown = await response.json().catch(() => null)

  if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string') {
    return body.error
  }

  return CREATE_PRODUCT_ERROR
}

export const createAdminProduct = async (token: string, product: NewProduct): Promise<AdminProduct> => {
  const response = await fetch(apiUrl('/api/admin/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return response.json() as Promise<AdminProduct>
}
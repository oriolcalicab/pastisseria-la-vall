import { apiUrl } from '../../../lib/api'
import type {
  AdminProduct,
  AdminProductPage,
  AdminProductVariant,
  NewProduct,
} from '../types/product'

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

const readErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  const body: unknown = await response.json().catch(() => null)

  if (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof body.error === 'string'
  ) {
    return body.error
  }

  return fallback
}

export const createAdminProduct = async (
  token: string,
  product: NewProduct,
): Promise<AdminProduct> => {
    const response = await fetch(apiUrl('/api/admin/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  }).catch(() => {
    throw new Error(CREATE_PRODUCT_ERROR)
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, CREATE_PRODUCT_ERROR))
  }

  return response.json() as Promise<AdminProduct>
}

const UPDATE_STATUS_ERROR = "No s'ha pogut canviar l'estat"

const sendActiveStatus = async <T>(token: string, path: string, isActive: boolean): Promise<T> => {
  const response = await fetch(apiUrl(`/api/admin${path}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
       body: JSON.stringify({ isActive }),
  }).catch(() => {
    throw new Error(UPDATE_STATUS_ERROR)
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, UPDATE_STATUS_ERROR))
  }

  return response.json() as Promise<T>
}

export const setAdminProductActive = (token: string, productId: number, isActive: boolean) =>
  sendActiveStatus<AdminProduct>(token, `/products/${productId}`, isActive)

export const setAdminVariantActive = (
  token: string,
  productId: number,
  variantId: number,
  isActive: boolean,
) =>
  sendActiveStatus<AdminProductVariant>(
    token,
    `/products/${productId}/variants/${variantId}`,
    isActive,
  )

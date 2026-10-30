import { apiUrl } from '../../../lib/api'
import type { ProductPage } from '../types/product'

const PAGE_SIZE = 12

export const fetchProducts = async (page: number): Promise<ProductPage> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
  const response = await fetch(apiUrl(`/api/products?${params}`))

  if (!response.ok) {
    throw new Error(`Products request failed with status ${response.status}`)
  }

  return response.json() as Promise<ProductPage>
}
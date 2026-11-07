import { apiUrl } from '../../../lib/api'
import type { ProductPage, Product } from '../types/product'

const PAGE_SIZE = 12

export const fetchProducts = async (page: number, diet: string): Promise<ProductPage> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })

  if (diet) params.set('diet', diet)

  const response = await fetch(apiUrl(`/api/products?${params}`))

  if (!response.ok) {
    throw new Error(`Products request failed with status ${response.status}`)
  }

  return response.json() as Promise<ProductPage>
}

export const fetchProduct = async (id: string): Promise<Product | null> => {
  const response = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}`))

  if (response.status === 400 || response.status === 404) return null

  if (!response.ok) {
    throw new Error(`Product request failed with status ${response.status}`)
  }

  return response.json() as Promise<Product>
}

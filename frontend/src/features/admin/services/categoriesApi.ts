import { apiUrl } from '../../../lib/api'
import type { Category } from '../types/category'

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(apiUrl('/api/categories'))

  if (!response.ok) {
    throw new Error(`Categories request failed with status ${response.status}`)
  }

  return response.json() as Promise<Category[]>
}
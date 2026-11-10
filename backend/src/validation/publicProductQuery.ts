import type { Diet, PublicProductQuery } from '../types/product.js'
import { parseProductListQuery } from './productListQuery.js'

const CATEGORY_SLUG_PATTERN = /^[a-z0-9-]{1,100}$/
const DIETS: readonly string[] = ['gluten_free', 'plant_milk', 'vegan']

const isDiet = (value: string): value is Diet => DIETS.includes(value)

const parseDiets = (value: unknown): Diet[] | null => {
  if (value === undefined) return []
  if (typeof value !== 'string') return null

  const diets = value.split(',')

  return diets.every(isDiet) ? [...new Set(diets)] : null
}

export const parsePublicProductQuery = (
  query: Record<string, unknown>,
): PublicProductQuery | null => {
  const listQuery = parseProductListQuery(query)

  if (!listQuery) return null

  const { category } = query

  if (category !== undefined) {
    if (typeof category !== 'string' || !CATEGORY_SLUG_PATTERN.test(category)) return null
  }

  const diets = parseDiets(query.diet)

  if (diets === null) return null

  return { page: listQuery.page, pageSize: listQuery.pageSize, category, diets }
}

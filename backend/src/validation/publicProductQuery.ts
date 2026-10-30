import type { PublicProductQuery } from '../types/product.js'
import { parseProductListQuery } from './productListQuery.js'

const CATEGORY_SLUG_PATTERN = /^[a-z0-9-]{1,100}$/

export const parsePublicProductQuery = (
  query: Record<string, unknown>,
): PublicProductQuery | null => {
  const listQuery = parseProductListQuery(query)

  if (!listQuery) return null

  const { category } = query

  if (category !== undefined) {
    if (typeof category !== 'string' || !CATEGORY_SLUG_PATTERN.test(category)) return null
  }

  return { page: listQuery.page, pageSize: listQuery.pageSize, category }
}
import type { ProductListQuery } from '../types/product.js'
import { parsePositiveInt } from './positiveInt.js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 50
const MAX_SEARCH_LENGTH = 100

const STATUS_FILTERS: Record<string, boolean> = { active: true, inactive: false }

export const parseProductListQuery = (query: Record<string, unknown>): ProductListQuery | null => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE)
  const pageSize = parsePositiveInt(query.pageSize, DEFAULT_PAGE_SIZE)

  if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) return null

  const { search, categoryId, status } = query

  if (search !== undefined && typeof search !== 'string') return null

  const parsedCategoryId = categoryId === undefined ? undefined : parsePositiveInt(categoryId, 1)

  if (parsedCategoryId === null) return null

  if (status !== undefined && (typeof status !== 'string' || !(status in STATUS_FILTERS))) {
    return null
  }

  const trimmedSearch = search?.trim().slice(0, MAX_SEARCH_LENGTH)

  return {
    page,
    pageSize,
    search: trimmedSearch || undefined,
    categoryId: parsedCategoryId,
    isActive: status === undefined ? undefined : STATUS_FILTERS[status],
  }
}

import type { ProductListQuery } from '../types/product.js'
import { parsePositiveInt } from './positiveInt.js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 50
const MAX_SEARCH_LENGTH = 100

export const parseProductListQuery = (query: Record<string, unknown>): ProductListQuery | null => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE)
  const pageSize = parsePositiveInt(query.pageSize, DEFAULT_PAGE_SIZE)

  if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) return null

  const { search } = query

  if (search !== undefined && typeof search !== 'string') return null

  const trimmedSearch = search?.trim().slice(0, MAX_SEARCH_LENGTH)

  return { page, pageSize, search: trimmedSearch || undefined }
}

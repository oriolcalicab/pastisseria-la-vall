import { OrderStatus } from '../generated/prisma/enums.js'
import type { AdminOrderListQuery } from '../types/order.js'
import { parsePositiveInt } from './positiveInt.js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 50

const orderStatuses: string[] = Object.values(OrderStatus)

const isOrderStatus = (value: string): value is OrderStatus => orderStatuses.includes(value)

export const parseAdminOrderListQuery = (
  query: Record<string, unknown>,
): AdminOrderListQuery | null => {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE)
  const pageSize = parsePositiveInt(query.pageSize, DEFAULT_PAGE_SIZE)

  if (page === null || pageSize === null || pageSize > MAX_PAGE_SIZE) return null

  const { status } = query

  if (status === undefined) return { page, pageSize, status: undefined }

  if (typeof status !== 'string' || !isOrderStatus(status)) return null

  return { page, pageSize, status }
}

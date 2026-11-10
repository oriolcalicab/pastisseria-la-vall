import type { CalendarQuery } from '../types/order.js'
import { isRealDate } from './realDate.js'

const MAX_DAYS = 62
const DAY_MS = 24 * 60 * 60 * 1000

export const parseCalendarQuery = (query: Record<string, unknown>): CalendarQuery | null => {
  const { from, to } = query

  if (!isRealDate(from) || !isRealDate(to)) return null

  const days = (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS

  if (days < 0 || days > MAX_DAYS) return null

  return { from, to }
}

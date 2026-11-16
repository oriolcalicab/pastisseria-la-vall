import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchCalendarOrders } from '../services/adminOrdersApi'
import type { CalendarFilters, CalendarOrder, CalendarRange } from '../types/calendar'

type CalendarResult = {
  key: string
  orders: CalendarOrder[] | null
}

type CalendarState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; orders: CalendarOrder[] }
) & { retry: () => void }

export const useCalendarOrders = (
  range: CalendarRange | null,
  filters: CalendarFilters,
): CalendarState => {
  const { user } = useAuth()
  const [result, setResult] = useState<CalendarResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = range
    ? `${range.from}|${range.to}|${filters.status}|${filters.deliveryMethod}|${attempt}`
    : null

  useEffect(() => {
    if (!user || !range || !key) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchCalendarOrders(token, range, filters))
      .then((orders) => {
        if (isActive) setResult({ key, orders })
      })
      .catch(() => {
        if (isActive) setResult({ key, orders: null })
      })

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key])

  const retry = () => setAttempt((current) => current + 1)

  if (!key || result?.key !== key) return { status: 'loading', retry }
  if (!result.orders) return { status: 'error', retry }

  return { status: 'success', orders: result.orders, retry }
}

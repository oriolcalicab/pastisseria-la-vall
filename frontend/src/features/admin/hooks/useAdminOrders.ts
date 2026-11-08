import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminOrders } from '../services/adminOrdersApi'
import type { AdminOrderPage, StatusFilter } from '../types/order'

type AdminOrdersParams = {
  page: number
  status: StatusFilter
}

type AdminOrdersResult = {
  key: string
  data: AdminOrderPage | null
}

type AdminOrdersState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; data: AdminOrderPage }
) & { retry: () => void }

export const useAdminOrders = ({ page, status }: AdminOrdersParams): AdminOrdersState => {
  const { user } = useAuth()
  const [result, setResult] = useState<AdminOrdersResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${page}|${status}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminOrders(token, { page, status }))
      .then((data) => {
        if (isActive) setResult({ key, data })
      })
      .catch(() => {
        if (isActive) setResult({ key, data: null })
      })

    return () => {
      isActive = false
    }
  }, [user, page, status, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }
  if (!result.data) return { status: 'error', retry }

  return { status: 'success', data: result.data, retry }
}

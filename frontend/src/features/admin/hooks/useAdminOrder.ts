import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminOrder } from '../services/adminOrdersApi'
import type { AdminOrderDetail } from '../types/order'

type AdminOrderOutcome =
  { status: 'error' } | { status: 'not-found' } | { status: 'success'; order: AdminOrderDetail }

type AdminOrderResult = {
  key: string
  outcome: AdminOrderOutcome
}

type AdminOrderState = ({ status: 'loading' } | AdminOrderOutcome) & { retry: () => void }

export const useAdminOrder = (id: string): AdminOrderState => {
  const { user } = useAuth()
  const [result, setResult] = useState<AdminOrderResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${id}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminOrder(token, id))
      .then((order) => {
        const outcome: AdminOrderOutcome = order
          ? { status: 'success', order }
          : { status: 'not-found' }

        if (isActive) setResult({ key, outcome })
      })
      .catch(() => {
        if (isActive) setResult({ key, outcome: { status: 'error' } })
      })

    return () => {
      isActive = false
    }
  }, [user, id, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }

  return { ...result.outcome, retry }
}

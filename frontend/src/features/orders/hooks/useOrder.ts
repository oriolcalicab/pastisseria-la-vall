import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchOrder } from '../services/ordersApi'
import type { OrderDetail } from '../types/order'

type OrderOutcome =
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'success'; order: OrderDetail }

type OrderResult = {
  key: string
  outcome: OrderOutcome
}

type OrderState = ({ status: 'loading' } | OrderOutcome) & { retry: () => void }

export const useOrder = (id: string): OrderState => {
  const { user } = useAuth()
  const [result, setResult] = useState<OrderResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${id}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchOrder(token, id))
      .then((order) => {
        const outcome: OrderOutcome = order
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

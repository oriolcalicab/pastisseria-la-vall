import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchOrders } from '../services/ordersApi'
import type { OrderSummary } from '../types/order'

type OrdersResult = {
  attempt: number
  orders: OrderSummary[] | null
}

type OrdersState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; orders: OrderSummary[] }
) & { retry: () => void }

export const useOrders = (): OrdersState => {
  const { user } = useAuth()
  const [result, setResult] = useState<OrdersResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchOrders(token))
      .then((orders) => {
        if (isActive) setResult({ attempt, orders })
      })
      .catch(() => {
        if (isActive) setResult({ attempt, orders: null })
      })

    return () => {
      isActive = false
    }
  }, [user, attempt])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.attempt !== attempt) return { status: 'loading', retry }
  if (!result.orders) return { status: 'error', retry }

  return { status: 'success', orders: result.orders, retry }
}

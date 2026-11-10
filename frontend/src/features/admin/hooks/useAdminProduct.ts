import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProduct } from '../services/adminProductsApi'
import type { AdminProductDetail } from '../types/product'

type AdminProductOutcome =
  { status: 'error' } | { status: 'not-found' } | { status: 'success'; product: AdminProductDetail }

type AdminProductResult = {
  key: string
  outcome: AdminProductOutcome
}

type AdminProductState = ({ status: 'loading' } | AdminProductOutcome) & { retry: () => void }

export const useAdminProduct = (id: string): AdminProductState => {
  const { user } = useAuth()
  const [result, setResult] = useState<AdminProductResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${id}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminProduct(token, id))
      .then((product) => {
        const outcome: AdminProductOutcome = product
          ? { status: 'success', product }
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

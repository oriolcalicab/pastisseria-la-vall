import { useEffect, useState } from 'react'
import { fetchProduct } from '../services/productsApi'
import type { Product } from '../types/product'

type ProductOutcome =
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'success'; product: Product }

type ProductResult = {
  key: string
  outcome: ProductOutcome
}

type ProductState = ({ status: 'loading' } | ProductOutcome) & { retry: () => void }

export const useProduct = (id: string): ProductState => {
  const [result, setResult] = useState<ProductResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${id}|${attempt}`

  useEffect(() => {
    let isActive = true

    fetchProduct(id)
      .then((product) => {
        const outcome: ProductOutcome = product
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
  }, [id, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }

  return { ...result.outcome, retry }
}
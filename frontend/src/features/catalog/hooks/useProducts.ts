import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productsApi'
import type { ProductPage } from '../types/product'

type ProductsResult = {
  key: string
  data: ProductPage | null
}

type ProductsState = (
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: ProductPage }
) & { retry: () => void }

export const useProducts = (page: number): ProductsState => {
  const [result, setResult] = useState<ProductsResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${page}|${attempt}`

  useEffect(() => {
    let isActive = true

    fetchProducts(page)
      .then((data) => {
        if (isActive) setResult({ key, data })
      })
      .catch(() => {
        if (isActive) setResult({ key, data: null })
      })

    return () => {
      isActive = false
    }
  }, [page, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }
  if (!result.data) return { status: 'error', retry }

  return { status: 'success', data: result.data, retry }
}
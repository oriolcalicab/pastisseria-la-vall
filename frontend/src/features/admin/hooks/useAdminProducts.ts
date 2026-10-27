import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProducts } from '../services/adminProductsApi'
import type { AdminProductPage } from '../types/product'

type AdminProductsParams = {
  page: number
  search: string
}

type AdminProductsResult = {
  key: string
  data: AdminProductPage | null
}

type AdminProductsState = (
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: AdminProductPage }
) & { retry: () => void }

export const useAdminProducts = ({ page, search }: AdminProductsParams): AdminProductsState => {
  const { user } = useAuth()
  const [result, setResult] = useState<AdminProductsResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${page}|${search}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminProducts(token, { page, search }))
      .then((data) => {
        if (isActive) setResult({ key, data })
      })
      .catch(() => {
        if (isActive) setResult({ key, data: null })
      })

    return () => {
      isActive = false
    }
  }, [user, page, search, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }
  if (!result.data) return { status: 'error', retry }

  return { status: 'success', data: result.data, retry }
}
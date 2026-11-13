import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProducts } from '../services/adminProductsApi'
import type {
  AdminProduct,
  AdminProductPage,
  AdminProductVariant,
  AdminProductsParams,
} from '../types/product'

type AdminProductsResult = {
  key: string
  data: AdminProductPage | null
}

type AdminProductsState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; data: AdminProductPage }
) & {
  retry: () => void
  replaceProduct: (product: AdminProduct) => void
  replaceVariant: (productId: number, variant: AdminProductVariant) => void
}

export const useAdminProducts = (params: AdminProductsParams): AdminProductsState => {
  const { user } = useAuth()
  const [result, setResult] = useState<AdminProductsResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const { page, search, categoryId = '', status = '' } = params
  const key = `${page}|${search}|${categoryId}|${status}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminProducts(token, params))
      .then((data) => {
        if (isActive) setResult({ key, data })
      })
      .catch(() => {
        if (isActive) setResult({ key, data: null })
      })

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key])

  const retry = () => setAttempt((current) => current + 1)

  const updateData = (update: (data: AdminProductPage) => AdminProductPage) =>
    setResult((current) => (current?.data ? { ...current, data: update(current.data) } : current))

  const replaceProduct = (product: AdminProduct) =>
    updateData((data) => ({
      ...data,
      items: data.items.map((item) => (item.id === product.id ? product : item)),
    }))

  const replaceVariant = (productId: number, variant: AdminProductVariant) =>
    updateData((data) => ({
      ...data,
      items: data.items.map((item) =>
        item.id === productId
          ? {
              ...item,
              variants: item.variants.map((current) =>
                current.id === variant.id ? variant : current,
              ),
            }
          : item,
      ),
    }))

  const actions = { retry, replaceProduct, replaceVariant }

  if (result?.key !== key) return { status: 'loading', ...actions }
  if (!result.data) return { status: 'error', ...actions }

  return { status: 'success', data: result.data, ...actions }
}

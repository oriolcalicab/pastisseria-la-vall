import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { setAdminProductActive, setAdminVariantActive } from '../services/adminProductsApi'
import type { AdminProduct, AdminProductVariant } from '../types/product'

type ActiveTogglesOptions = {
  onProductChange: (product: AdminProduct) => void
  onVariantChange: (productId: number, variant: AdminProductVariant) => void
}

const UPDATE_STATUS_ERROR = "No s'ha pogut canviar l'estat"

export const useActiveToggles = ({ onProductChange, onVariantChange }: ActiveTogglesOptions) => {
  const { user } = useAuth()
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState('')

  const run = async (key: string, action: (token: string) => Promise<void>) => {
    if (!user || pendingKey) return

    setPendingKey(key)
    setError('')

    try {
      await action(await user.getIdToken())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : UPDATE_STATUS_ERROR)
    } finally {
      setPendingKey(null)
    }
  }

  const toggleProduct = (product: AdminProduct) =>
    run(`product-${product.id}`, async (token) => {
      onProductChange(await setAdminProductActive(token, product.id, !product.isActive))
    })

  const toggleVariant = (product: AdminProduct, variant: AdminProductVariant) =>
    run(`variant-${variant.id}`, async (token) => {
      const updated = await setAdminVariantActive(token, product.id, variant.id, !variant.isActive)
      onVariantChange(product.id, updated)
    })

  return { pendingKey, error, toggleProduct, toggleVariant }
}
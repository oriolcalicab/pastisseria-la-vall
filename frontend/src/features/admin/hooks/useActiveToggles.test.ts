import { act, renderHook } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { setAdminProductActive, setAdminVariantActive } from '../services/adminProductsApi'
import type { AdminProduct } from '../types/product'
import { useActiveToggles } from './useActiveToggles'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminProductsApi', () => ({
  setAdminProductActive: vi.fn(),
  setAdminVariantActive: vi.fn(),
}))

const product: AdminProduct = {
  id: 7,
  name: 'Pastís de xocolata',
  isActive: true,
  category: { id: 1, name: 'Pastissos' },
  variants: [{ id: 12, name: '6 racions', priceCents: 3900, stock: 5, isActive: false }],
}

const renderToggles = () => {
  const onProductChange = vi.fn()
  const onVariantChange = vi.fn()
  const { result } = renderHook(() => useActiveToggles({ onProductChange, onVariantChange }))

  return { result, onProductChange, onVariantChange }
}

describe('useActiveToggles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('deactivates an active product and passes the new version', async () => {
    // Given an active product
    const updated = { ...product, isActive: false }
    vi.mocked(setAdminProductActive).mockResolvedValue(updated)
    const { result, onProductChange } = renderToggles()

    // When the admin toggles it
    await act(() => result.current.toggleProduct(product))

    // Then it is deactivated and the list receives the new version
    expect(setAdminProductActive).toHaveBeenCalledWith('token-123', 7, false)
    expect(onProductChange).toHaveBeenCalledWith(updated)
    expect(result.current.pendingKey).toBeNull()
  })

  it('activates an inactive variant of the product', async () => {
    // Given an inactive variant
    const updated = { ...product.variants[0], isActive: true }
    vi.mocked(setAdminVariantActive).mockResolvedValue(updated)
    const { result, onVariantChange } = renderToggles()

    // When the admin toggles it
    await act(() => result.current.toggleVariant(product, product.variants[0]))

    // Then it is activated and the list receives the new version
    expect(setAdminVariantActive).toHaveBeenCalledWith('token-123', 7, 12, true)
    expect(onVariantChange).toHaveBeenCalledWith(7, updated)
  })

  it('shows the error and does not change the list when it fails', async () => {
    // Given a backend that fails
    vi.mocked(setAdminProductActive).mockRejectedValue(new Error('El producte no existeix'))
    const { result, onProductChange } = renderToggles()

    // When the admin toggles the product
    await act(() => result.current.toggleProduct(product))

    // Then the error is shown, the list is not changed and the button is free again
    expect(result.current.error).toBe('El producte no existeix')
    expect(onProductChange).not.toHaveBeenCalled()
    expect(result.current.pendingKey).toBeNull()
  })
})
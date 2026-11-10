import { renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProduct } from '../services/adminProductsApi'
import type { AdminProductDetail } from '../types/product'
import { useAdminProduct } from './useAdminProduct'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminProductsApi', () => ({ fetchAdminProduct: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const product = { id: 7, name: 'Pastís de xocolata' } as AdminProductDetail

describe('useAdminProduct', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the product with the token of the admin', async () => {
    // Given a backend with the product
    vi.mocked(fetchAdminProduct).mockResolvedValue(product)

    // When the hook asks for it
    const { result } = renderHook(() => useAdminProduct('7'))

    // Then it is loading first and then it has the product
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ product })
    expect(fetchAdminProduct).toHaveBeenCalledWith('token-123', '7')
  })

  it('tells when the product does not exist', async () => {
    // Given a backend without the product
    vi.mocked(fetchAdminProduct).mockResolvedValue(null)

    // When the hook asks for it
    const { result } = renderHook(() => useAdminProduct('999'))

    // Then the status is not found
    await waitFor(() => expect(result.current.status).toBe('not-found'))
  })
})

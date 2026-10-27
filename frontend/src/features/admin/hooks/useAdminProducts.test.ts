import { act, renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProducts } from '../services/adminProductsApi'
import type { AdminProductPage } from '../types/product'
import { useAdminProducts } from './useAdminProducts'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminProductsApi', () => ({ fetchAdminProducts: vi.fn() }))

const productPage: AdminProductPage = { items: [], page: 2, pageSize: 20, total: 0, totalPages: 0 }

describe('useAdminProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the requested page', async () => {
    // Given a backend that returns a page of products
    vi.mocked(fetchAdminProducts).mockResolvedValue(productPage)

    // When the hook asks for the second page searching "croi"
    const { result } = renderHook(() => useAdminProducts({ page: 2, search: 'croi' }))

    // Then it is loading first and then it has the data
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ data: productPage })
    expect(fetchAdminProducts).toHaveBeenCalledWith('token-123', { page: 2, search: 'croi' })
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchAdminProducts).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the products
    const { result } = renderHook(() => useAdminProducts({ page: 1, search: '' }))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchAdminProducts)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(productPage)
    const { result } = renderHook(() => useAdminProducts({ page: 1, search: '' }))
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the products are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchAdminProducts).toHaveBeenCalledTimes(2)
  })
})
import { act, renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminProducts } from '../services/adminProductsApi'
import type { AdminProductPage } from '../types/product'
import { useAdminProducts } from './useAdminProducts'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminProductsApi', () => ({ fetchAdminProducts: vi.fn() }))

const productPage: AdminProductPage = {
  items: [
    {
      id: 7,
      name: 'Pastís de xocolata',
      isActive: true,
      category: { id: 1, name: 'Pastissos' },
      variants: [{ id: 12, name: '6 racions', priceCents: 3900, stock: 5, isActive: true }],
    },
  ],
  page: 2,
  pageSize: 20,
  total: 1,
  totalPages: 1,
}

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
    it('replaces a product without asking the backend again', async () => {
    // Given a loaded page
    vi.mocked(fetchAdminProducts).mockResolvedValue(productPage)
    const { result } = renderHook(() => useAdminProducts({ page: 1, search: '' }))
    await waitFor(() => expect(result.current.status).toBe('success'))

    // When the product is replaced by its deactivated version
    act(() => result.current.replaceProduct({ ...productPage.items[0], isActive: false }))

    // Then the page shows the new status and the backend is not called again
    expect(result.current).toMatchObject({ data: { items: [{ id: 7, isActive: false }] } })
    expect(fetchAdminProducts).toHaveBeenCalledOnce()
  })

  it('replaces a variant inside its product', async () => {
    // Given a loaded page
    vi.mocked(fetchAdminProducts).mockResolvedValue(productPage)
    const { result } = renderHook(() => useAdminProducts({ page: 1, search: '' }))
    await waitFor(() => expect(result.current.status).toBe('success'))

    // When the variant is replaced by its deactivated version
    const variant = { ...productPage.items[0].variants[0], isActive: false }
    act(() => result.current.replaceVariant(7, variant))

    // Then only that variant changes
    expect(result.current).toMatchObject({
      data: { items: [{ id: 7, isActive: true, variants: [{ id: 12, isActive: false }] }] },
    })
  })
})
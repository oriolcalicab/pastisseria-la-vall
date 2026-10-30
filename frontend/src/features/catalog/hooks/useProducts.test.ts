import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchProducts } from '../services/productsApi'
import type { ProductPage } from '../types/product'
import { useProducts } from './useProducts'

vi.mock('../services/productsApi', () => ({ fetchProducts: vi.fn() }))

const productPage: ProductPage = { items: [], page: 2, pageSize: 12, total: 0, totalPages: 0 }

describe('useProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the requested page', async () => {
    // Given a backend that returns a page
    vi.mocked(fetchProducts).mockResolvedValue(productPage)

    // When the hook asks for the second page
    const { result } = renderHook(() => useProducts(2))

    // Then it is loading first and then it has the data
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ data: productPage })
    expect(fetchProducts).toHaveBeenCalledWith(2)
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchProducts).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the products
    const { result } = renderHook(() => useProducts(1))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchProducts)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(productPage)
    const { result } = renderHook(() => useProducts(1))
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the products are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchProducts).toHaveBeenCalledTimes(2)
  })
})
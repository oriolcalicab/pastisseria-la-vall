import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchProduct } from '../services/productsApi'
import type { Product } from '../types/product'
import { useProduct } from './useProduct'

vi.mock('../services/productsApi', () => ({ fetchProduct: vi.fn() }))

const product = { id: 7, name: 'Pastís de xocolata' } as Product

describe('useProduct', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the product', async () => {
    // Given a backend with the product
    vi.mocked(fetchProduct).mockResolvedValue(product)

    // When the hook asks for it
    const { result } = renderHook(() => useProduct('7'))

    // Then it is loading first and then it has the product
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ product })
    expect(fetchProduct).toHaveBeenCalledWith('7')
  })

  it('tells when the product does not exist', async () => {
    // Given a backend without the product
    vi.mocked(fetchProduct).mockResolvedValue(null)

    // When the hook asks for it
    const { result } = renderHook(() => useProduct('9999'))

    // Then the status is not found
    await waitFor(() => expect(result.current.status).toBe('not-found'))
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchProduct).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the product
    const { result } = renderHook(() => useProduct('7'))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchProduct)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(product)
    const { result } = renderHook(() => useProduct('7'))
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the product is loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchProduct).toHaveBeenCalledTimes(2)
  })

    it('asks for the new product when the id changes', async () => {
    // Given a loaded product
    vi.mocked(fetchProduct).mockResolvedValue(product)
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: '7' },
    })
    await waitFor(() => expect(result.current.status).toBe('success'))

    // When the id changes
    rerender({ id: '8' })

    // Then it is loading again and the new product is requested
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchProduct).toHaveBeenLastCalledWith('8')
  })
})
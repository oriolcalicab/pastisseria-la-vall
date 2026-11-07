import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchShippingFee } from '../services/checkoutApi'
import { useShippingFee } from './useShippingFee'

vi.mock('../services/checkoutApi', () => ({ fetchShippingFee: vi.fn() }))

describe('useShippingFee', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the shipping fee', async () => {
    // Given a fee of 500 cents
    vi.mocked(fetchShippingFee).mockResolvedValue(500)

    // When the hook is used
    const { result } = renderHook(() => useShippingFee())

    // Then it is loading first and then it has the fee
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', feeCents: 500 }))
  })

  it('accepts a free shipping', async () => {
    // Given a fee of 0 cents
    vi.mocked(fetchShippingFee).mockResolvedValue(0)

    // When the hook is used
    const { result } = renderHook(() => useShippingFee())

    // Then 0 is a valid fee and not an error
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', feeCents: 0 }))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchShippingFee)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(500)
    const { result } = renderHook(() => useShippingFee())
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the fee is loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchShippingFee).toHaveBeenCalledTimes(2)
  })
})

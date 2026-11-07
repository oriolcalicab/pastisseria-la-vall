import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchDeliveryDates } from '../services/deliveryApi'
import { useDeliveryDates } from './useDeliveryDates'

vi.mock('../services/deliveryApi', () => ({ fetchDeliveryDates: vi.fn() }))

const days = [{ date: '2026-12-01', available: true, reason: null }]

describe('useDeliveryDates', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the days of the month', async () => {
    // Given a backend with the days of December
    vi.mocked(fetchDeliveryDates).mockResolvedValue({ month: '2026-12', days })

    // When the hook asks for December
    const { result } = renderHook(() => useDeliveryDates('2026-12'))

    // Then it is loading first and then it has the days
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ days })
    expect(fetchDeliveryDates).toHaveBeenCalledWith('2026-12')
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchDeliveryDates).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the days
    const { result } = renderHook(() => useDeliveryDates('2026-12'))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchDeliveryDates)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce({ month: '2026-12', days })
    const { result } = renderHook(() => useDeliveryDates('2026-12'))
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the days are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchDeliveryDates).toHaveBeenCalledTimes(2)
  })
})

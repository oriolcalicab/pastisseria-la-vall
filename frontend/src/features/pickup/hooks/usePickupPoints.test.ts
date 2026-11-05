import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchPickupPoints } from '../services/pickupPointsApi'
import type { PickupPoint } from '../types/pickupPoint'
import { usePickupPoints } from './usePickupPoints'

vi.mock('../services/pickupPointsApi', () => ({ fetchPickupPoints: vi.fn() }))

const points: PickupPoint[] = [
  {
    id: 2,
    name: 'La Vall · Eixample',
    address: 'Carrer de Girona, 84',
    city: 'Barcelona',
    latitude: 41.3965,
    longitude: 2.1675,
    openingHours: 'De dt. a ds., de 9 a 19 h',
  },
]

describe('usePickupPoints', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the pickup points', async () => {
    // Given a backend with pickup points
    vi.mocked(fetchPickupPoints).mockResolvedValue(points)

    // When the hook is used
    const { result } = renderHook(() => usePickupPoints())

    // Then it is loading first and then it has the points
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current).toMatchObject({ status: 'success', points }))
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchPickupPoints).mockRejectedValue(new Error('Request failed'))

    // When the hook is used
    const { result } = renderHook(() => usePickupPoints())

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchPickupPoints)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(points)
    const { result } = renderHook(() => usePickupPoints())
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the user retries
    act(() => result.current.retry())

    // Then the points are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchPickupPoints).toHaveBeenCalledTimes(2)
  })
})
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchPickupPoints } from './pickupPointsApi'

describe('fetchPickupPoints', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the pickup points', async () => {
    // Given a backend with one pickup point
    const points = [
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
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => points })
    vi.stubGlobal('fetch', fetchMock)

    // When the pickup points are requested
    const result = await fetchPickupPoints()

    // Then the public endpoint is called and the points are returned
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/pickup-points'))
    expect(result).toEqual(points)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the pickup points are requested
    // Then the call fails
    await expect(fetchPickupPoints()).rejects.toThrow()
  })
})

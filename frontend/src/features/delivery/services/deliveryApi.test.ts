import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchDeliveryDates } from './deliveryApi'

describe('fetchDeliveryDates', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the days of the month', async () => {
    // Given a backend with the days of December
    const deliveryMonth = { month: '2026-12', days: [] }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => deliveryMonth })
    vi.stubGlobal('fetch', fetchMock)

    // When December is requested
    const result = await fetchDeliveryDates('2026-12')

    // Then the public endpoint is called with the month
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/delivery-dates?month=2026-12'),
    )
    expect(result).toEqual(deliveryMonth)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the days are requested
    // Then the call fails
    await expect(fetchDeliveryDates('2026-12')).rejects.toThrow()
  })
})
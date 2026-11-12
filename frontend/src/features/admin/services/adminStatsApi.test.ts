import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAdminStats } from './adminStatsApi'

const range = { from: '2026-10-14', to: '2026-11-12' }

describe('adminStatsApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the stats of the range with the token', async () => {
    // Given a backend that answers the stats
    const stats = { ...range, revenueCents: 7500 }
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(stats)))
    vi.stubGlobal('fetch', fetchMock)

    // When the stats are requested
    const result = await fetchAdminStats('token-123', range)

    // Then the range goes in the query and the token in the header
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/admin/stats?from=2026-10-14&to=2026-11-12')
    expect(options).toEqual({ headers: { Authorization: 'Bearer token-123' } })
    expect(result).toEqual(stats)
  })

  it('fails when the backend answers an error', async () => {
    // Given a backend that rejects the request
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 400 })))

    // When the stats are requested
    // Then the request fails
    await expect(fetchAdminStats('token-123', range)).rejects.toThrow('400')
  })
})

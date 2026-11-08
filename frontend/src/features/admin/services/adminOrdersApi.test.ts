import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAdminOrders } from './adminOrdersApi'

const page = { items: [], page: 2, pageSize: 20, total: 21, totalPages: 2 }

describe('fetchAdminOrders', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the page and the status with the token', async () => {
    // Given a backend with orders
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => page })
    vi.stubGlobal('fetch', fetchMock)

    // When the second page of the ready orders is requested
    const result = await fetchAdminOrders('token-123', { page: 2, status: 'ready' })

    // Then the page, the status and the token are sent
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/orders?page=2&status=ready'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token-123' } }),
    )
    expect(result).toEqual(page)
  })

  it('does not send the status when all the statuses are wanted', async () => {
    // Given a backend with orders
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => page })
    vi.stubGlobal('fetch', fetchMock)

    // When all the orders are requested
    await fetchAdminOrders('token-123', { page: 1, status: '' })

    // Then only the page is sent
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/orders\?page=1$/),
      expect.anything(),
    )
  })
})

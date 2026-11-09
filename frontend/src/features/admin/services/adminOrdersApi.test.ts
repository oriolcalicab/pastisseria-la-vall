import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchAdminOrders,
  fetchAdminOrder,
  changeAdminOrderStatus,
  OrderStatusConflictError,
} from './adminOrdersApi'

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

describe('fetchAdminOrder', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the order with the token', async () => {
    // Given a backend with the order
    const order = { id: 7, orderNumber: 'LV-261106-4F2A9C' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => order })
    vi.stubGlobal('fetch', fetchMock)

    // When the order is requested
    const result = await fetchAdminOrder('token-123', '7')

    // Then the token is sent and the order is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/orders/7'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token-123' } }),
    )
    expect(result).toEqual(order)
  })

  it('returns null when the order does not exist', async () => {
    // Given a backend without the order
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    // When the order is requested
    // Then nothing is returned
    expect(await fetchAdminOrder('token-123', '999')).toBeNull()
  })
})

describe('changeAdminOrderStatus', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the new status with the token', async () => {
    // Given a backend that changes the status
    const order = { id: 7, status: 'preparing' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => order })
    vi.stubGlobal('fetch', fetchMock)

    // When the admin starts preparing the order
    const result = await changeAdminOrderStatus('token-123', 7, 'preparing')

    // Then the status is sent with PATCH and the order is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/orders/7/status'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'preparing' }),
      }),
    )
    expect(result).toEqual(order)
  })

  it('throws a conflict error when someone else changed the order', async () => {
    // Given a backend that answers 409
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409 }))

    // When the admin changes the status
    // Then a conflict error is thrown
    await expect(changeAdminOrderStatus('token-123', 7, 'ready')).rejects.toBeInstanceOf(
      OrderStatusConflictError,
    )
  })
})

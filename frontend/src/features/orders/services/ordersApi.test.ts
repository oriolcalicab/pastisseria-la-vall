import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchOrder, fetchOrders } from './ordersApi'

describe('fetchOrder', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the order with the token', async () => {
    // Given a backend with the order
    const order = { id: 1, orderNumber: 'LV-261106-4F2A9C' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => order })
    vi.stubGlobal('fetch', fetchMock)

    // When the order is requested
    const result = await fetchOrder('token-123', '1')

    // Then the token is sent and the order is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders/1'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token-123' } }),
    )
    expect(result).toEqual(order)
  })

  it('returns null when the order is not of the customer', async () => {
    // Given a backend that does not find the order
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    // When the order is requested
    // Then nothing is returned
    expect(await fetchOrder('token-123', '1')).toBeNull()
  })

  it('throws when the backend fails', async () => {
    // Given a backend with an error
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the order is requested
    // Then it throws
    await expect(fetchOrder('token-123', '1')).rejects.toThrow()
  })
})

describe('fetchOrders', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the orders with the token', async () => {
    // Given a backend with one order
    const orders = [{ id: 1, orderNumber: 'LV-261106-4F2A9C' }]
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => orders })
    vi.stubGlobal('fetch', fetchMock)

    // When the orders are requested
    const result = await fetchOrders('token-123')

    // Then the token is sent and the orders are returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token-123' } }),
    )
    expect(result).toEqual(orders)
  })

  it('throws when the backend fails', async () => {
    // Given a backend with an error
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the orders are requested
    // Then it throws
    await expect(fetchOrders('token-123')).rejects.toThrow()
  })
})

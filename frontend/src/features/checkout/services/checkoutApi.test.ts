import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOrder, fetchShippingFee, OrderRequestError } from './checkoutApi'

describe('fetchShippingFee', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the shipping fee in cents', async () => {
    // Given a backend with a fee of 500 cents
    const json = async () => ({ shippingFeeCents: 500 })
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json })
    vi.stubGlobal('fetch', fetchMock)

    // When the fee is requested
    // Then the cents are returned
    await expect(fetchShippingFee()).resolves.toBe(500)
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/checkout/shipping-fee'))
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the fee is requested
    // Then the call fails
    await expect(fetchShippingFee()).rejects.toThrow()
  })
})

describe('createOrder', () => {
  const payload = {
    idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
    deliveryDate: '2026-11-12',
    deliveryMethod: 'pickup' as const,
    pickupPointId: 2,
    lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the order with the token and returns it', async () => {
    // Given a backend that creates the order
    const order = { id: 1, orderNumber: 'LV-261106-4F2A9C', status: 'pending', totalCents: 7800 }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => order })
    vi.stubGlobal('fetch', fetchMock)

    // When the order is sent
    const result = await createOrder('token-123', payload)

    // Then it is sent with the token and the order is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
        body: JSON.stringify(payload),
      }),
    )
    expect(result).toEqual(order)
  })

  it('throws the message and the warnings of the backend', async () => {
    // Given a backend that rejects the order because a price changed
    const warnings = [{ variantId: 12, type: 'price_changed' }]
    const json = async () => ({ error: 'Alguns productes han canviat. Revisa el carretó', warnings })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409, json }))

    // When the order is sent
    const error = await createOrder('token-123', payload).catch((caught: unknown) => caught)

    // Then the error has the message and the warnings
    expect(error).toBeInstanceOf(OrderRequestError)
    expect(error).toMatchObject({
      message: 'Alguns productes han canviat. Revisa el carretó',
      warnings,
    })
  })

  it('throws a clear message when the backend can not be reached', async () => {
    // Given a backend that is not running
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    // When the order is sent
    // Then the message is in Catalan
    await expect(createOrder('token-123', payload)).rejects.toThrow(
      "No s'ha pogut confirmar la comanda. Torna-ho a provar",
    )
  })
})

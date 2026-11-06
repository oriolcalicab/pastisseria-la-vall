import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchShippingFee } from './checkoutApi'

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
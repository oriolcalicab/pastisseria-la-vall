import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CartLine } from '../types/cart'
import { validateCart } from './cartApi'

const line: CartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

describe('validateCart', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('only sends what the backend needs', async () => {
    // Given a backend that validates the cart
    const result = { lines: [line], warnings: [], totalCents: 7800 }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => result })
    vi.stubGlobal('fetch', fetchMock)

    // When the cart is validated
    const response = await validateCart([line])

    // Then only the id, the quantity and the price are sent
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/cart/validate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }] }),
      }),
    )
    expect(response).toEqual(result)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the cart is validated
    // Then the call fails
    await expect(validateCart([line])).rejects.toThrow()
  })
})
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { validateCart } from './cartService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: { productVariant: { findMany: vi.fn() } },
}))

describe('validateCart', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('compares the cart with the variants of the database', async () => {
    // Given a variant with a new price
    const variant = {
      id: 12,
      name: '6 racions',
      priceCents: 4200,
      stock: 5,
      isActive: true,
      product: { id: 7, name: 'Pastís de xocolata', imageUrl: null, isActive: true },
    }
    vi.mocked(prisma.productVariant.findMany).mockResolvedValue([variant] as never)

    // When the cart is validated
    const result = await validateCart([{ variantId: 12, quantity: 1, priceCents: 3900 }])

    // Then the variants of the cart are requested and the current price is used
    expect(prisma.productVariant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: [12] } } }),
    )
    expect(result.lines[0]?.priceCents).toBe(4200)
    expect(result.warnings).toEqual([{ variantId: 12, type: 'price_changed' }])
  })
})

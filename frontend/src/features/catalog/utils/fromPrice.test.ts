import { describe, expect, it } from 'vitest'
import { getFromPriceCents } from './fromPrice'

describe('getFromPriceCents', () => {
  it('returns the lowest price', () => {
    // Given two variants
    const variants = [
      { id: 1, name: '10 racions', priceCents: 4900, inStock: true },
      { id: 2, name: '6 racions', priceCents: 3900, inStock: false },
    ]

    // When the from price is calculated
    // Then the cheapest one is returned, even if it is sold out
    expect(getFromPriceCents(variants)).toBe(3900)
  })
})
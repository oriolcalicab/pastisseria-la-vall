import { describe, expect, it } from 'vitest'
import { getDefaultVariant } from './defaultVariant'

const soldOut = { id: 1, name: '6 racions', priceCents: 3900, inStock: false }
const available = { id: 2, name: '10 racions', priceCents: 4900, inStock: true }

describe('getDefaultVariant', () => {
  it('returns the first variant in stock', () => {
    // Given a sold out variant and one in stock
    // When the default variant is calculated
    // Then the one in stock is returned
    expect(getDefaultVariant([soldOut, available])).toBe(available)
  })

  it('returns null when all the variants are sold out', () => {
    // Given only sold out variants
    // When the default variant is calculated
    // Then there is no variant
    expect(getDefaultVariant([soldOut])).toBeNull()
  })
})
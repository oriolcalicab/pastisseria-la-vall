import { describe, expect, it } from 'vitest'
import type { AdminProductVariant } from '../types/product'
import { getFromPriceCents, getTotalStock } from './productSummary'

const variant = (priceCents: number, stock: number, isActive = true): AdminProductVariant => ({
  id: priceCents,
  name: `Variant ${priceCents}`,
  priceCents,
  stock,
  isActive,
})

describe('getFromPriceCents', () => {
  it('returns the lowest price of the active variants', () => {
    // Given two active variants and a cheaper inactive one
    const variants = [variant(280, 5), variant(150, 10), variant(100, 3, false)]

    // When the from price is calculated
    // Then the inactive variant is ignored
    expect(getFromPriceCents(variants)).toBe(150)
  })

  it('returns null when there is no active variant', () => {
    // Given only inactive variants
    // When the from price is calculated
    // Then there is no price
    expect(getFromPriceCents([variant(150, 10, false)])).toBeNull()
  })
})

describe('getTotalStock', () => {
  it('adds the stock of all the variants', () => {
    // Given an active and an inactive variant
    // When the total stock is calculated
    // Then both are counted
    expect(getTotalStock([variant(150, 10), variant(280, 30, false)])).toBe(40)
  })

  it('returns 0 when there are no variants', () => {
    // Given a product without variants
    // When the total stock is calculated
    // Then the stock is 0
    expect(getTotalStock([])).toBe(0)
  })
})
import { describe, expect, it } from 'vitest'
import { formatProductCount } from './productCount'

describe('formatProductCount', () => {
  it('uses the singular for one product', () => {
    // Given one product
    // When the count is written
    // Then it is singular
    expect(formatProductCount(1)).toBe('1 producte')
  })

  it('uses the plural for several products', () => {
    // Given eight products
    // When the count is written
    // Then it is plural
    expect(formatProductCount(8)).toBe('8 productes')
  })
})

import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats cents as euros', () => {
    // Given a price of 150 cents
    // When it is formatted
    // Then it is shown as euros with a comma
    expect(formatPrice(150)).toMatch(/^1,50\s€$/)
  })
})
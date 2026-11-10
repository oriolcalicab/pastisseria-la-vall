import { describe, expect, it } from 'vitest'
import { isRealDate } from './realDate.js'

describe('isRealDate', () => {
  it('accepts a real day', () => {
    // Given a real day
    // When it is checked
    // Then it is valid
    expect(isRealDate('2026-11-12')).toBe(true)
  })

  it('rejects a day that does not exist', () => {
    // Given the 30th of February
    // When it is checked
    // Then it is not valid
    expect(isRealDate('2026-02-30')).toBe(false)
  })

  it('rejects an impossible month without breaking', () => {
    // Given the month 13
    // When it is checked
    // Then it is not valid and nothing is thrown
    expect(isRealDate('2026-13-01')).toBe(false)
  })
})

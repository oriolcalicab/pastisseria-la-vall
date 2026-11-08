import { describe, expect, it } from 'vitest'
import { toDateKey } from './dateKey.js'

describe('toDateKey', () => {
  it('returns the day of a date without the time', () => {
    // Given a date saved in the database
    const date = new Date('2026-11-12T00:00:00Z')

    // When it is converted
    // Then only the day is kept
    expect(toDateKey(date)).toBe('2026-11-12')
  })
})

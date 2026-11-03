import { describe, expect, it } from 'vitest'
import { parseMonthQuery } from './monthQuery.js'

describe('parseMonthQuery', () => {
  it('returns the month', () => {
    // Given a valid month
    // When it is parsed
    // Then it is returned
    expect(parseMonthQuery('2026-12', '2026-11')).toBe('2026-12')
  })

  it('uses the default month when there is none', () => {
    // Given no month
    // When it is parsed
    // Then the default month is used
    expect(parseMonthQuery(undefined, '2026-11')).toBe('2026-11')
  })

  it.each(['2026-13', '2026-00', '2026-1', 'abc', ['2026-11', '2026-12']])(
    'returns null for %j',
    (value) => {
      // Given an invalid month
      // When it is parsed
      // Then null is returned
      expect(parseMonthQuery(value, '2026-11')).toBeNull()
    },
  )
})
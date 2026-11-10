import { describe, expect, it } from 'vitest'
import { parseCalendarQuery } from './calendarQuery.js'

describe('parseCalendarQuery', () => {
  it('returns the range of days', () => {
    // Given a month
    // When the query is parsed
    // Then the range is returned
    expect(parseCalendarQuery({ from: '2026-11-01', to: '2026-11-30' })).toEqual({
      from: '2026-11-01',
      to: '2026-11-30',
    })
  })

  it('returns null when a day is missing', () => {
    // Given a query without the end
    // When the query is parsed
    // Then null is returned
    expect(parseCalendarQuery({ from: '2026-11-01' })).toBeNull()
  })

  it('returns null when the start is after the end', () => {
    // Given a range backwards
    // When the query is parsed
    // Then null is returned
    expect(parseCalendarQuery({ from: '2026-11-30', to: '2026-11-01' })).toBeNull()
  })

  it('returns null when the range is too long', () => {
    // Given a whole year
    // When the query is parsed
    // Then null is returned
    expect(parseCalendarQuery({ from: '2026-01-01', to: '2026-12-31' })).toBeNull()
  })
})

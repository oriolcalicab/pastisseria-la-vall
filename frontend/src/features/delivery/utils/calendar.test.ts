import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  blockReasonLabels,
  getCalendarWeeks,
  getDayLabel,
  getMonthLabel,
  getMonthOf,
  getCurrentMonth,
} from './calendar'

describe('addMonths', () => {
  it.each([
    ['2026-11', 1, '2026-12'],
    ['2026-12', 1, '2027-01'],
    ['2027-01', -1, '2026-12'],
  ])('moves %s by %i months to %s', (month, amount, expected) => {
    // Given a month
    // When some months are added
    // Then the year changes when needed
    expect(addMonths(month, amount)).toBe(expected)
  })
})

describe('addDays', () => {
  it.each([
    ['2026-11-30', 1, '2026-12-01'],
    ['2026-12-31', 1, '2027-01-01'],
    ['2026-11-05', -7, '2026-10-29'],
  ])('moves %s by %i days to %s', (date, amount, expected) => {
    // Given a day
    // When some days are added
    // Then the month and the year change when needed
    expect(addDays(date, amount)).toBe(expected)
  })
})

describe('getMonthOf', () => {
  it('returns the month of a day', () => {
    // Given a day
    // When its month is requested
    // Then the year and the month are returned
    expect(getMonthOf('2026-11-05')).toBe('2026-11')
  })
})

describe('getCalendarWeeks', () => {
  it('leaves empty cells before a month that starts on Sunday', () => {
    // Given November 2026, which starts on Sunday
    const weeks = getCalendarWeeks('2026-11')

    // When the weeks are built
    // Then the first day is in the last cell of the first week
    expect(weeks).toHaveLength(6)
    expect(weeks[0]).toEqual([null, null, null, null, null, null, '2026-11-01'])
    expect(weeks[5]?.[0]).toBe('2026-11-30')
    expect(weeks.every((week) => week.length === 7)).toBe(true)
  })

  it('has no empty cells when the month starts on Monday', () => {
    // Given February 2027, which starts on Monday and has 28 days
    const weeks = getCalendarWeeks('2027-02')

    // When the weeks are built
    // Then there are exactly four full weeks
    expect(weeks).toHaveLength(4)
    expect(weeks[0]?.[0]).toBe('2027-02-01')
    expect(weeks.flat()).not.toContain(null)
  })
})

describe('labels', () => {
  it('names the month in Catalan', () => {
    // Given a month
    // When its label is built
    // Then it has the name of the month and the year
    expect(getMonthLabel('2026-11')).toMatch(/novembre.*2026/)
  })

  it('names the day in Catalan', () => {
    // Given a day
    // When its label is built
    // Then it has the weekday, the day and the month
    expect(getDayLabel('2026-11-05')).toMatch(/dijous.*5.*novembre/)
  })

  it('explains why a day is blocked', () => {
    // Given a Sunday
    // When the reason is shown
    // Then the visitor knows why
    expect(blockReasonLabels.sunday).toBe('els diumenges no fem lliuraments')
  })
})

describe('getCurrentMonth', () => {
  it('uses the month in Barcelona', () => {
    // Given the last night of October in UTC, already November in Barcelona
    // When the current month is calculated
    // Then it is November
    expect(getCurrentMonth(new Date('2026-10-31T23:30:00Z'))).toBe('2026-11')
  })
})

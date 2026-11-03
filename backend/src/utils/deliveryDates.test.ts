import { describe, expect, it } from 'vitest'
import type { DeliveryRules } from '../types/delivery.js'
import { getDeliveryDay, getMadridNowMs, getMonthDays } from './deliveryDates.js'

const rules = (overrides: Partial<DeliveryRules> = {}): DeliveryRules => ({
  nowMs: Date.UTC(2026, 10, 2, 10, 0),
  minPrepHours: 48,
  maxOrdersPerDay: 5,
  closedDates: new Set(),
  orderCounts: new Map(),
  ...overrides,
})

describe('getMadridNowMs', () => {
  it('adds one hour in winter', () => {
    // Given a time in winter
    // When it is converted to the time in Barcelona
    // Then it is one hour later than UTC
    expect(getMadridNowMs(new Date('2026-11-02T09:00:00Z'))).toBe(Date.UTC(2026, 10, 2, 10, 0))
  })

  it('adds two hours in summer', () => {
    // Given a time in summer
    // When it is converted to the time in Barcelona
    // Then it is two hours later than UTC
    expect(getMadridNowMs(new Date('2026-07-01T10:00:00Z'))).toBe(Date.UTC(2026, 6, 1, 12, 0))
  })
})

describe('getMonthDays', () => {
  it('returns all the days of the month', () => {
    // Given a month of 30 days
    const days = getMonthDays('2026-11')

    // When the days are generated
    // Then the first and the last day are correct
    expect(days).toHaveLength(30)
    expect(days[0]).toBe('2026-11-01')
    expect(days[29]).toBe('2026-11-30')
  })

  it('knows the leap years', () => {
    // Given February of a leap year
    // When the days are generated
    // Then it has 29 days
    expect(getMonthDays('2028-02')).toHaveLength(29)
  })
})

describe('getDeliveryDay', () => {
  it('accepts a day with enough time', () => {
    // Given Monday at 10:00
    // When Thursday is checked (62 hours later)
    // Then it is available
    expect(getDeliveryDay('2026-11-05', rules())).toEqual({
      date: '2026-11-05',
      available: true,
      reason: null,
    })
  })

  it('accepts a day exactly 48 hours later', () => {
    // Given Tuesday at 00:00
    const nowMs = Date.UTC(2026, 10, 3, 0, 0)

    // When Thursday is checked
    // Then it is available
    expect(getDeliveryDay('2026-11-05', rules({ nowMs })).available).toBe(true)
  })

  it.each([
    ['a past day', '2026-11-01', 'past'],
    ['today', '2026-11-02', 'too_soon'],
    ['a day 38 hours later', '2026-11-04', 'too_soon'],
    ['a Sunday', '2026-11-08', 'sunday'],
  ])('blocks %s', (_case, date, reason) => {
    // Given Monday at 10:00
    // When the day is checked
    // Then it is blocked with its reason
    expect(getDeliveryDay(date, rules())).toMatchObject({ available: false, reason })
  })

  it('blocks a closed day', () => {
    // Given a holiday
    const closedDates = new Set(['2026-12-08'])

    // When the day is checked
    // Then it is closed
    expect(getDeliveryDay('2026-12-08', rules({ closedDates })).reason).toBe('closed')
  })

  it('blocks a day that is full', () => {
    // Given a day with 5 orders
    const orderCounts = new Map([['2026-11-06', 5]])

    // When the day is checked
    // Then it is full
    expect(getDeliveryDay('2026-11-06', rules({ orderCounts })).reason).toBe('full')
  })

  it('accepts a day with one free place', () => {
    // Given a day with 4 orders
    const orderCounts = new Map([['2026-11-06', 4]])

    // When the day is checked
    // Then it is available
    expect(getDeliveryDay('2026-11-06', rules({ orderCounts })).available).toBe(true)
  })

  it('uses the settings', () => {
    // Given 24 hours of preparation and a maximum of 1 order
    const custom = rules({ minPrepHours: 24, maxOrdersPerDay: 1 })

    // When two days are checked
    // Then the new limits are used
    expect(getDeliveryDay('2026-11-04', custom).available).toBe(true)
    expect(
      getDeliveryDay('2026-11-04', { ...custom, orderCounts: new Map([['2026-11-04', 1]]) }).reason,
    ).toBe('full')
  })
})
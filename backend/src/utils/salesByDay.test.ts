import { describe, expect, it } from 'vitest'
import { salesByDay } from './salesByDay.js'

describe('salesByDay', () => {
  it('adds up the orders of each day', () => {
    // Given two orders on the 10th and one on the 12th
    const orders = [
      { createdAt: new Date('2026-11-10T09:00:00Z'), totalCents: 2500 },
      { createdAt: new Date('2026-11-10T18:30:00Z'), totalCents: 1800 },
      { createdAt: new Date('2026-11-12T11:00:00Z'), totalCents: 3200 },
    ]

    // When the sales are grouped from the 10th to the 12th
    const days = salesByDay(orders, '2026-11-10', '2026-11-12')

    // Then every day is there, the 11th with zero
    expect(days).toEqual([
      { date: '2026-11-10', orders: 2, revenueCents: 4300 },
      { date: '2026-11-11', orders: 0, revenueCents: 0 },
      { date: '2026-11-12', orders: 1, revenueCents: 3200 },
    ])
  })

  it('returns one empty day when there are no orders', () => {
    expect(salesByDay([], '2026-11-12', '2026-11-12')).toEqual([
      { date: '2026-11-12', orders: 0, revenueCents: 0 },
    ])
  })
})

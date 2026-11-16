import { describe, expect, it } from 'vitest'
import type { AdminStats } from '../types/stats'
import { averageOrderCents, percentOf, totalOrders } from './statsFigures'

const stats = {
  revenueCents: 10000,
  orderCount: 3,
  ordersByStatus: { pending: 1, preparing: 0, ready: 0, delivered: 2, cancelled: 1 },
} as AdminStats

describe('statsFigures', () => {
  it('rounds the average order to whole cents', () => {
    expect(averageOrderCents(stats)).toBe(3333)
  })

  it('has no average when there are no orders', () => {
    expect(averageOrderCents({ ...stats, revenueCents: 0, orderCount: 0 })).toBe(0)
  })

  it('counts the orders of every status, cancelled too', () => {
    expect(totalOrders(stats)).toBe(4)
  })

  it('rounds the percentage and avoids dividing by zero', () => {
    expect(percentOf(1, 3)).toBe(33)
    expect(percentOf(0, 0)).toBe(0)
  })
})

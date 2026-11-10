import { describe, expect, it } from 'vitest'
import { formatOrderDate, orderStatusLabels } from './orderLabels'

describe('orderLabels', () => {
  it('has a text in Catalan for each status', () => {
    // Given the statuses of an order
    // When their texts are read
    // Then each one has its label
    expect(orderStatusLabels).toEqual({
      pending: 'Pendent',
      preparing: 'En preparació',
      ready: 'Llesta',
      delivered: 'Entregada',
      cancelled: 'Cancel·lada',
    })
  })

  it('shows the day of the order in the time of Barcelona', () => {
    // Given an order created at 23:30 UTC, which is already the next day in Barcelona
    // When the date is formatted
    // Then the day of Barcelona is shown
    expect(formatOrderDate('2026-11-06T23:30:00.000Z')).toBe('7 de novembre del 2026')
  })
})

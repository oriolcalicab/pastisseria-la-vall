import { describe, expect, it } from 'vitest'
import { createOrderNumber } from './orderNumber.js'

describe('createOrderNumber', () => {
  it('uses the date in Barcelona and a short code', () => {
    // Given the last night of October in UTC, already November in Barcelona
    // When an order number is created
    // Then it has the date of Barcelona and six characters of the code
    expect(
      createOrderNumber(new Date('2026-10-31T23:30:00Z'), '4f2a9c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12'),
    ).toBe('LV-261101-4F2A9C')
  })

  it('creates a different number each time', () => {
    // Given the same moment
    const now = new Date('2026-11-06T10:00:00Z')

    // When two numbers are created
    // Then they are different
    expect(createOrderNumber(now)).not.toBe(createOrderNumber(now))
  })
})

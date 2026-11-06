import { describe, expect, it } from 'vitest'
import { getOrderTotals } from './orderTotals'

describe('getOrderTotals', () => {
  it('adds the shipping fee for a home delivery', () => {
    // Given a subtotal of 9200 cents and a fee of 500
    // When the totals of a home delivery are calculated
    // Then the fee is added
    expect(getOrderTotals(9200, 'delivery', 500)).toEqual({
      subtotalCents: 9200,
      shippingCents: 500,
      totalCents: 9700,
    })
  })

  it('does not charge shipping for a pickup', () => {
    // Given a subtotal of 9200 cents and a fee of 500
    // When the totals of a pickup are calculated
    // Then there is no shipping
    expect(getOrderTotals(9200, 'pickup', 500)).toEqual({
      subtotalCents: 9200,
      shippingCents: 0,
      totalCents: 9200,
    })
  })
})
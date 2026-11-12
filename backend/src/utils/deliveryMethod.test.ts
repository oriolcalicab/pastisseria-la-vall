import { describe, expect, it } from 'vitest'
import { isDeliveryMethod } from './deliveryMethod.js'

describe('isDeliveryMethod', () => {
  it('accepts the two delivery methods', () => {
    expect(isDeliveryMethod('delivery')).toBe(true)
    expect(isDeliveryMethod('pickup')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isDeliveryMethod('drone')).toBe(false)
    expect(isDeliveryMethod(['pickup'])).toBe(false)
  })
})

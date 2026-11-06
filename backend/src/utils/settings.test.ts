import { describe, expect, it } from 'vitest'
import { readNumberSetting } from './settings.js'

describe('readNumberSetting', () => {
  it('returns the value of the setting', () => {
    // Given a setting with a number
    const settings = [{ key: 'shipping_fee_cents', value: '650' }]

    // When it is read
    // Then the number is returned
    expect(readNumberSetting(settings, 'shipping_fee_cents', 500)).toBe(650)
  })

  it('uses the fallback when the setting is missing', () => {
    // Given no settings
    // When a setting is read
    // Then the fallback is returned
    expect(readNumberSetting([], 'shipping_fee_cents', 500)).toBe(500)
  })

  it.each(['abc', '-1', '1.5'])('uses the fallback when the value is %s', (value) => {
    // Given a setting that is not a valid number
    const settings = [{ key: 'shipping_fee_cents', value }]

    // When it is read
    // Then the fallback is returned
    expect(readNumberSetting(settings, 'shipping_fee_cents', 500)).toBe(500)
  })
})
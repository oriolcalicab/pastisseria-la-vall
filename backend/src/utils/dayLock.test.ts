import { describe, expect, it } from 'vitest'
import { getDayLockKey } from './dayLock.js'

describe('getDayLockKey', () => {
  it('turns the date into a number', () => {
    // Given a delivery date
    // When its lock key is created
    // Then it is the date as a number
    expect(getDayLockKey('2026-11-12')).toBe(20261112)
  })

  it('gives a different key to each day', () => {
    // Given two different days
    // When their keys are created
    // Then they are different
    expect(getDayLockKey('2026-11-12')).not.toBe(getDayLockKey('2026-11-13'))
  })
})

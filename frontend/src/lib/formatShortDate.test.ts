import { describe, expect, it } from 'vitest'
import { formatShortDate } from './formatShortDate'

describe('formatShortDate', () => {
  it('writes a delivery day as dd/mm/yyyy', () => {
    expect(formatShortDate('2026-11-15')).toBe('15/11/2026')
  })

  it('uses the day of Barcelona for a time near midnight', () => {
    expect(formatShortDate('2026-11-15T23:30:00Z')).toBe('16/11/2026')
  })
})

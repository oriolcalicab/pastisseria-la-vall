import { describe, expect, it } from 'vitest'
import { formatDayLabel, presetRange, rangeError, toLocalDateKey } from './dateRange'

const today = new Date(2026, 10, 12, 18, 30)

describe('dateRange', () => {
  it('writes the local day as YYYY-MM-DD', () => {
    expect(toLocalDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })

  it('counts today inside the last 7 and the last 30 days', () => {
    expect(presetRange('last7', today)).toEqual({ from: '2026-11-06', to: '2026-11-12' })
    expect(presetRange('last30', today)).toEqual({ from: '2026-10-14', to: '2026-11-12' })
  })

  it('starts this month on the first day', () => {
    expect(presetRange('thisMonth', today)).toEqual({ from: '2026-11-01', to: '2026-11-12' })
  })

  it('accepts a range that goes forward, a single day too', () => {
    expect(rangeError({ from: '2026-11-01', to: '2026-11-12' })).toBeNull()
    expect(rangeError({ from: '2026-11-12', to: '2026-11-12' })).toBeNull()
  })

  it('explains why a range is not valid', () => {
    expect(rangeError({ from: '', to: '2026-11-12' })).toBe('Tria les dues dates.')
    expect(rangeError({ from: '2026-11-12', to: '2026-11-01' })).toBe(
      "La data d'inici no pot ser posterior a la final.",
    )
    expect(rangeError({ from: '2025-01-01', to: '2026-11-12' })).toBe(
      'Tria un període de com a màxim un any.',
    )
  })

  it('shows the day and the month on the chart', () => {
    expect(formatDayLabel('2026-11-05')).toBe('5/11')
  })
})

import { describe, expect, it } from 'vitest'
import { parseStatsQuery } from './statsQuery.js'

describe('parseStatsQuery', () => {
  it('accepts a real range', () => {
    expect(parseStatsQuery({ from: '2026-10-14', to: '2026-11-12' })).toEqual({
      from: '2026-10-14',
      to: '2026-11-12',
    })
  })

  it('accepts a single day', () => {
    expect(parseStatsQuery({ from: '2026-11-12', to: '2026-11-12' })).not.toBeNull()
  })

  it('rejects a range backwards', () => {
    expect(parseStatsQuery({ from: '2026-11-12', to: '2026-11-01' })).toBeNull()
  })

  it('rejects a range longer than a year', () => {
    expect(parseStatsQuery({ from: '2025-01-01', to: '2026-11-12' })).toBeNull()
  })

  it('rejects an impossible date', () => {
    expect(parseStatsQuery({ from: '2026-02-30', to: '2026-03-10' })).toBeNull()
  })

  it('rejects a missing date', () => {
    expect(parseStatsQuery({ from: '2026-11-01' })).toBeNull()
  })
})

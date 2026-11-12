import { describe, expect, it } from 'vitest'
import { formatUnitCount } from './unitCount'

describe('formatUnitCount', () => {
  it('uses the singular for one unit', () => {
    // Given one unit
    // When the count is written
    // Then it is singular
    expect(formatUnitCount(1)).toBe('1 unitat')
  })

  it('uses the plural for several units', () => {
    // Given three units
    // When the count is written
    // Then it is plural
    expect(formatUnitCount(3)).toBe('3 unitats')
  })
})

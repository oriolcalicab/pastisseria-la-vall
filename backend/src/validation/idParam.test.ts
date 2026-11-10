import { describe, expect, it } from 'vitest'
import { parseIdParam } from './idParam.js'

describe('parseIdParam', () => {
  it.each([
    ['1', 1],
    ['42', 42],
    ['2147483647', 2147483647],
  ])('converts "%s" to %i', (value, id) => {
    // Given a valid id from the URL
    // When it is parsed
    // Then the number is returned
    expect(parseIdParam(value)).toBe(id)
  })

  it.each(['0', '-1', '1.5', 'abc', '007', '', '2147483648'])('rejects "%s"', (value) => {
    // Given an id that is not valid
    // When it is parsed
    // Then null is returned
    expect(parseIdParam(value)).toBeNull()
  })

  it('rejects a value that is not text', () => {
    // Given an id that is not a string
    // When it is parsed
    // Then null is returned
    expect(parseIdParam(undefined)).toBeNull()
  })
})

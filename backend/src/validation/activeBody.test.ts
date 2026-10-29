import { describe, expect, it } from 'vitest'
import { parseActiveBody } from './activeBody.js'

describe('parseActiveBody', () => {
  it.each([true, false])('returns isActive %s', (isActive) => {
    // Given a body with a boolean isActive
    // When the body is parsed
    // Then the value is returned
    expect(parseActiveBody({ isActive })).toEqual({ isActive })
  })

  it('ignores any other field', () => {
    // Given a body that also tries to change the name
    // When the body is parsed
    // Then only isActive is returned
    expect(parseActiveBody({ isActive: false, name: 'Hackejat' })).toEqual({ isActive: false })
  })

  it.each([
    ['text', { isActive: 'false' }],
    ['a number', { isActive: 0 }],
    ['missing', {}],
    ['not an object', null],
  ])('returns null when isActive is %s', (_case, body) => {
    // Given a body without a boolean isActive
    // When the body is parsed
    // Then null is returned
    expect(parseActiveBody(body)).toBeNull()
  })
})
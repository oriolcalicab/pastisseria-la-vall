import { describe, expect, it } from 'vitest'
import { parseRegisterBody } from './registerBody.js'

describe('parseRegisterBody', () => {
  it('returns the trimmed name for a valid body', () => {
    // Given a body with a valid name surrounded by spaces
    // When the body is parsed
    // Then the trimmed name is returned
    expect(parseRegisterBody({ name: '  Oriol  ' })).toEqual({ name: 'Oriol' })
  })

  it('ignores any role sent in the body', () => {
    // Given a body that tries to send an admin role
    // When the body is parsed
    // Then only the name is returned
    expect(parseRegisterBody({ name: 'Oriol', role: 'admin' })).toEqual({ name: 'Oriol' })
  })

  it('returns null when the name is too short', () => {
    // Given a body with a one-character name
    // When the body is parsed
    // Then null is returned
    expect(parseRegisterBody({ name: 'A' })).toBeNull()
  })

  it('returns null when the name is not a string', () => {
    // Given a body with a numeric name
    // When the body is parsed
    // Then null is returned
    expect(parseRegisterBody({ name: 123 })).toBeNull()
  })

  it('returns null when there is no body', () => {
    // Given an undefined body
    // When the body is parsed
    // Then null is returned
    expect(parseRegisterBody(undefined)).toBeNull()
  })
})

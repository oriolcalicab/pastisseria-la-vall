import { describe, expect, it } from 'vitest'
import { getBearerToken } from './bearerToken.js'

describe('getBearerToken', () => {
  it('returns the token from a valid header', () => {
    // Given an Authorization header with a Bearer token
    // When the token is extracted
    // Then the token is returned
    expect(getBearerToken('Bearer abc123')).toBe('abc123')
  })

  it('returns null when the header is missing', () => {
    // Given no Authorization header
    // When the token is extracted
    // Then null is returned
    expect(getBearerToken(undefined)).toBeNull()
  })

  it('returns null when the scheme is not Bearer', () => {
    // Given an Authorization header with another scheme
    // When the token is extracted
    // Then null is returned
    expect(getBearerToken('Basic abc123')).toBeNull()
  })

  it('returns null when the token is empty', () => {
    // Given a Bearer header without token
    // When the token is extracted
    // Then null is returned
    expect(getBearerToken('Bearer')).toBeNull()
  })
})
import { describe, expect, it } from 'vitest'
import { getRedirectPath } from './redirect'

describe('getRedirectPath', () => {
  it('returns the original page the user wanted to visit', () => {
    // Given a login redirected from a protected page
    // When the redirect path is calculated
    // Then the original path and query are returned
    expect(getRedirectPath({ from: { pathname: '/compte', search: '?tab=1' } })).toBe(
      '/compte?tab=1',
    )
  })

  it('returns the home page when there is no previous page', () => {
    // Given a direct visit to the login page
    // When the redirect path is calculated
    // Then the home page is returned
    expect(getRedirectPath(undefined)).toBe('/')
  })

  it('rejects external or malformed paths', () => {
    // Given a state with a path that points outside the app
    // When the redirect path is calculated
    // Then the home page is returned
    expect(getRedirectPath({ from: { pathname: '//evil.com' } })).toBe('/')
    expect(getRedirectPath({ from: { pathname: 'https://evil.com' } })).toBe('/')
  })
})
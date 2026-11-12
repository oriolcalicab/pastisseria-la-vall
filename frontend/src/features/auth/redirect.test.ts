import { describe, expect, it } from 'vitest'
import { getLoginRedirectPath, getRedirectPath } from './redirect'

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

describe('getLoginRedirectPath', () => {
  it('takes an admin to the admin panel after a direct login', () => {
    // Given an admin who opened the login page directly
    // When the path after the login is calculated
    // Then it is the admin panel
    expect(getLoginRedirectPath(undefined, 'admin')).toBe('/admin')
  })

  it('takes a customer to the home page after a direct login', () => {
    // Given a customer who opened the login page directly
    // When the path after the login is calculated
    // Then it is the home page
    expect(getLoginRedirectPath(undefined, 'customer')).toBe('/')
  })

  it('keeps the page the user wanted to visit, admin or not', () => {
    // Given a login that comes from the checkout
    const state = { from: { pathname: '/checkout' } }

    // When the path after the login is calculated
    // Then it goes back to the checkout
    expect(getLoginRedirectPath(state, 'admin')).toBe('/checkout')
    expect(getLoginRedirectPath(state, 'customer')).toBe('/checkout')
  })
})

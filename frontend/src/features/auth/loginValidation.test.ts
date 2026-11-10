import { describe, expect, it } from 'vitest'
import { validateLogin } from './validation'

describe('validateLogin', () => {
  it('returns no errors for valid credentials', () => {
    // Given a valid email and a password
    // When the login form is validated
    // Then the errors object is empty
    expect(validateLogin({ email: 'oriol@test.com', password: 'abc' })).toEqual({})
  })

  it('returns an error for an invalid email', () => {
    // Given an incomplete email
    // When the login form is validated
    // Then there is an email error
    expect(validateLogin({ email: 'oriol@', password: 'abc' }).email).toBeDefined()
  })

  it('returns an error for an empty password', () => {
    // Given an empty password
    // When the login form is validated
    // Then there is a password error
    expect(validateLogin({ email: 'oriol@test.com', password: '' }).password).toBeDefined()
  })
})

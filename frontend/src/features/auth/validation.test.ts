import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateName,
  validatePassword,
  validateRegister,
} from './validation'

describe('register validation', () => {
  it('rejects a name shorter than 2 characters', () => {
    // Given a name with a single character
    // When the name is validated
    // Then an error message is returned
    expect(validateName('A')).toBeDefined()
  })

  it('accepts a name with accents', () => {
    // Given a name with accented characters
    // When the name is validated
    // Then no error is returned
    expect(validateName('Núria Vallès')).toBeUndefined()
  })

  it('rejects an email without domain', () => {
    // Given an incomplete email
    // When the email is validated
    // Then an error message is returned
    expect(validateEmail('oriol@')).toBeDefined()
  })

  it('rejects a password shorter than 8 characters', () => {
    // Given a password with 7 characters
    // When the password is validated
    // Then an error message is returned
    expect(validatePassword('1234567')).toBeDefined()
  })

  it('accepts a password with exactly 8 characters', () => {
    // Given a password with 8 characters
    // When the password is validated
    // Then no error is returned
    expect(validatePassword('12345678')).toBeUndefined()
  })

  it('returns no errors for valid data', () => {
    // Given valid name, email and password
    // When the whole form is validated
    // Then the errors object is empty
    expect(
      validateRegister({
        name: 'Oriol',
        email: 'oriol@test.com',
        password: '12345678',
      }),
    ).toEqual({})
  })

  it('returns an error for every invalid field', () => {
    // Given an empty form
    // When the whole form is validated
    // Then there is an error for name, email and password
    expect(
      Object.keys(validateRegister({ name: '', email: '', password: '' })),
    ).toEqual(['name', 'email', 'password'])
  })
})

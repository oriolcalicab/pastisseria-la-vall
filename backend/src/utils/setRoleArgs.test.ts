import { describe, expect, it } from 'vitest'
import { parseSetRoleArgs } from './setRoleArgs.js'

describe('parseSetRoleArgs', () => {
  it('returns the email and role for valid arguments', () => {
    // Given a valid email and the admin role
    // When the arguments are parsed
    // Then the normalized email and role are returned
    expect(parseSetRoleArgs(['Oriol@Test.com', 'admin'])).toEqual({
      email: 'oriol@test.com',
      role: 'admin',
    })
  })

  it('returns null when the role does not exist', () => {
    // Given an unknown role
    // When the arguments are parsed
    // Then null is returned
    expect(parseSetRoleArgs(['oriol@test.com', 'superuser'])).toBeNull()
  })

  it('returns null when the email is not valid', () => {
    // Given a value that is not an email
    // When the arguments are parsed
    // Then null is returned
    expect(parseSetRoleArgs(['oriol', 'admin'])).toBeNull()
  })

  it('returns null when arguments are missing', () => {
    // Given no arguments
    // When the arguments are parsed
    // Then null is returned
    expect(parseSetRoleArgs([])).toBeNull()
  })
})

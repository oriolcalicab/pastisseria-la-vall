import { describe, expect, it } from 'vitest'
import { getLoginErrorMessage } from './loginErrorMessage'

describe('getLoginErrorMessage', () => {
  it('returns a clear message for wrong credentials', () => {
    // Given a Firebase invalid credential error
    // When the message is requested
    // Then the user sees that email or password are wrong
    expect(getLoginErrorMessage({ code: 'auth/invalid-credential' })).toBe(
      'Correu o contrasenya incorrectes',
    )
  })

  it('returns a specific message when there are too many attempts', () => {
    // Given a Firebase too-many-requests error
    // When the message is requested
    // Then the user is told to try later
    expect(getLoginErrorMessage({ code: 'auth/too-many-requests' })).toBe(
      'Massa intents fallits. Prova-ho més tard.',
    )
  })

  it('returns a generic message for unknown errors', () => {
    // Given an unexpected error
    // When the message is requested
    // Then a generic message is returned
    expect(getLoginErrorMessage(new Error('boom'))).toBe(
      "No s'ha pogut iniciar la sessió. Torna-ho a provar.",
    )
  })
})

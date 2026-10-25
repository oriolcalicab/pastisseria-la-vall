import { describe, expect, it } from 'vitest'
import { getPasswordResetErrorMessage } from './passwordResetErrorMessage'

describe('getPasswordResetErrorMessage', () => {
  it('asks to try later when there are too many requests', () => {
    // Given a Firebase too-many-requests error
    // When the message is requested
    // Then the user is told to try later
    expect(getPasswordResetErrorMessage({ code: 'auth/too-many-requests' })).toBe(
      'Massa intents. Prova-ho més tard.',
    )
  })

  it('returns a generic message for unknown errors', () => {
    // Given an unexpected error
    // When the message is requested
    // Then a generic message is returned
    expect(getPasswordResetErrorMessage(new Error('boom'))).toBe(
      "No s'ha pogut enviar el correu. Torna-ho a provar.",
    )
  })
})
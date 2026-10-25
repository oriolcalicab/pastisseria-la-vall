import { createUserWithEmailAndPassword } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailAlreadyInUseError, registerUser } from './authService'

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))
vi.mock('../../../lib/firebase', () => ({ auth: {} }))

const values = { name: 'Oriol', email: 'oriol@test.com', password: '12345678' }

describe('registerUser', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('throws EmailAlreadyInUseError when the email is already registered', async () => {
    // Given Firebase rejects the signup because the email exists
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: 'auth/email-already-in-use',
    })

    // When the user tries to register
    // Then a specific EmailAlreadyInUseError is thrown
    await expect(registerUser(values)).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('rethrows any other error', async () => {
    // Given Firebase fails for an unexpected reason
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(new Error('boom'))

    // When the user tries to register
    // Then the original error is thrown
    await expect(registerUser(values)).rejects.toThrow('boom')
  })
})
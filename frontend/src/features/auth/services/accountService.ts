import type { User } from 'firebase/auth'
import type { RegisterValues } from '../types/type'
import { registerInBackend } from './authApi'
import { registerUser } from './authService'
import { loginWithEmail, logout } from './sessionService'

const MIN_NAME_LENGTH = 2
const FALLBACK_NAME = 'Client'

const getDisplayName = (user: User): string => {
  const name = user.displayName?.trim() || user.email?.split('@')[0] || ''

  return name.length >= MIN_NAME_LENGTH ? name : FALLBACK_NAME
}

export const registerAccount = async (values: RegisterValues): Promise<void> => {
  const firebaseUser = await registerUser(values)
  const token = await firebaseUser.getIdToken()

  await registerInBackend(token, values.name.trim())
}

export const loginAccount = async (email: string, password: string): Promise<void> => {
  const firebaseUser = await loginWithEmail(email, password)

  try {
    const token = await firebaseUser.getIdToken()
    await registerInBackend(token, getDisplayName(firebaseUser))
  } catch (error) {
    await logout()
    throw error
  }
}
import type { RegisterValues } from '../types/type'
import { registerInBackend } from './authApi'
import { registerUser } from './authService'

export const registerAccount = async (values: RegisterValues): Promise<void> => {
  const firebaseUser = await registerUser(values)
  const token = await firebaseUser.getIdToken()

  await registerInBackend(token, values.name.trim())
}
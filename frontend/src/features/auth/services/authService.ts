import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../../lib/firebase'
import type { RegisterValues } from '../types/type'
import { hasErrorCode } from '../utils/hasErrorCode'

const EMAIL_IN_USE_CODE = 'auth/email-already-in-use'

export class EmailAlreadyInUseError extends Error {}

export async function registerUser({ name, email, password }: RegisterValues) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(user, { displayName: name.trim() })
    return user
  } catch (error) {
    if (hasErrorCode(error, EMAIL_IN_USE_CODE)) {
      throw new EmailAlreadyInUseError()
    }
    throw error
  }
}

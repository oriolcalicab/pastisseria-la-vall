import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../lib/firebase'
import { hasErrorCode } from '../utils/hasErrorCode'

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email.trim())
  } catch (error) {
    if (hasErrorCode(error, 'auth/user-not-found')) return

    throw error
  }
}

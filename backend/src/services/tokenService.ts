import { firebaseAuth } from '../config/firebaseAdmin.js'
import type { VerifiedUser } from '../types/auth.js'

export const verifyFirebaseToken = async (token: string): Promise<VerifiedUser> => {
  const decoded = await firebaseAuth.verifyIdToken(token)

  if (!decoded.email) {
    throw new Error('Token without email')
  }

  return { uid: decoded.uid, email: decoded.email }
}

import { firebaseAuth } from '../config/firebaseAdmin.js'

export type VerifiedUser = {
  uid: string
  email: string
}

export const verifyFirebaseToken = async (token: string): Promise<VerifiedUser> => {
  const decoded = await firebaseAuth.verifyIdToken(token)

  if (!decoded.email) {
    throw new Error('Token without email')
  }

  return { uid: decoded.uid, email: decoded.email }
}

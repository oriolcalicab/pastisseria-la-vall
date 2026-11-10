import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password)

  return user
}

export const logout = (): Promise<void> => signOut(auth)

export const subscribeToAuthChanges = (callback: (user: User | null) => void): (() => void) =>
  onAuthStateChanged(auth, callback)

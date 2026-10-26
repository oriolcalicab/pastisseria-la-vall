import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

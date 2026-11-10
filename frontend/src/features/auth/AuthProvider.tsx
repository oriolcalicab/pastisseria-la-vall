import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { AuthContext } from './AuthContext'
import { subscribeToAuthChanges } from './services/sessionService'

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(
    () =>
      subscribeToAuthChanges((currentUser) => {
        setUser(currentUser)
        setIsLoading(false)
      }),
    [],
  )

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

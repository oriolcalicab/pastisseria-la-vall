import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../services/authApi'
import type { CurrentUser } from '../services/authApi'
import { useAuth } from './useAuth'

type CurrentUserResult = {
  uid: string
  currentUser: CurrentUser | null
}

export const useCurrentUser = () => {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [result, setResult] = useState<CurrentUserResult | null>(null)

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then(fetchCurrentUser)
      .then((currentUser) => {
        if (isActive) setResult({ uid: user.uid, currentUser })
      })
      .catch(() => {
        if (isActive) setResult({ uid: user.uid, currentUser: null })
      })

    return () => {
      isActive = false
    }
  }, [user])

  if (isAuthLoading) return { currentUser: null, isLoading: true }
  if (!user) return { currentUser: null, isLoading: false }
  if (result?.uid !== user.uid) return { currentUser: null, isLoading: true }

  return { currentUser: result.currentUser, isLoading: false }
}

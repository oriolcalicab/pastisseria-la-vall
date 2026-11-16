import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminStats } from '../services/adminStatsApi'
import type { AdminStats, StatsRange } from '../types/stats'

type StatsResult = {
  key: string
  stats: AdminStats | null
}

export type AdminStatsState = (
  { status: 'loading' } | { status: 'error' } | { status: 'success'; stats: AdminStats }
) & { retry: () => void }

export const useAdminStats = (range: StatsRange): AdminStatsState => {
  const { user } = useAuth()
  const [result, setResult] = useState<StatsResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const key = `${range.from}|${range.to}|${attempt}`

  useEffect(() => {
    if (!user) return

    let isActive = true

    user
      .getIdToken()
      .then((token) => fetchAdminStats(token, range))
      .then((stats) => {
        if (isActive) setResult({ key, stats })
      })
      .catch(() => {
        if (isActive) setResult({ key, stats: null })
      })

    return () => {
      isActive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, key])

  const retry = () => setAttempt((current) => current + 1)

  if (result?.key !== key) return { status: 'loading', retry }
  if (!result.stats) return { status: 'error', retry }

  return { status: 'success', stats: result.stats, retry }
}

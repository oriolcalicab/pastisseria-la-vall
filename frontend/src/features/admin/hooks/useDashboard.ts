import { useContext } from 'react'
import { DashboardContext } from '../context/DashboardContext'
import type { AdminStats } from '../types/stats'

export const useDashboard = () => {
  const context = useContext(DashboardContext)

  if (!context) {
    throw new Error('useDashboard must be used inside DashboardProvider')
  }

  return context
}

export const useLoadedStats = (): AdminStats => {
  const { stats } = useDashboard()

  if (stats.status !== 'success') {
    throw new Error('useLoadedStats must be used once the stats are loaded')
  }

  return stats.stats
}

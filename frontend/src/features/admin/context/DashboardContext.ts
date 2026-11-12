import { createContext } from 'react'
import type { AdminStatsState } from '../hooks/useAdminStats'
import type { RangePreset, StatsRange } from '../types/stats'

export type DashboardContextValue = {
  preset: RangePreset
  range: StatsRange
  selectPreset: (preset: Exclude<RangePreset, 'custom'>) => void
  applyCustomRange: (range: StatsRange) => void
  stats: AdminStatsState
}

export const DashboardContext = createContext<DashboardContextValue | undefined>(undefined)

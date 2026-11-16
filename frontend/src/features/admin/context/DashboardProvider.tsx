import { useState } from 'react'
import type { ReactNode } from 'react'
import { useAdminStats } from '../hooks/useAdminStats'
import type { RangePreset, StatsRange } from '../types/stats'
import { presetRange } from '../utils/dateRange'
import { DashboardContext } from './DashboardContext'

type DashboardProviderProps = {
  children: ReactNode
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [preset, setPreset] = useState<RangePreset>('last30')
  const [range, setRange] = useState<StatsRange>(() => presetRange('last30', new Date()))
  const stats = useAdminStats(range)

  const selectPreset = (next: Exclude<RangePreset, 'custom'>) => {
    setPreset(next)
    setRange(presetRange(next, new Date()))
  }

  const applyCustomRange = (next: StatsRange) => {
    setPreset('custom')
    setRange(next)
  }

  return (
    <DashboardContext.Provider value={{ preset, range, selectPreset, applyCustomRange, stats }}>
      {children}
    </DashboardContext.Provider>
  )
}

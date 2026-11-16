import type { RangePreset, StatsRange } from '../types/stats'

const MAX_DAYS = 366
const DAY_MS = 24 * 60 * 60 * 1000

const pad = (value: number) => String(value).padStart(2, '0')

export const toLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const daysBefore = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - days)

export const presetRange = (preset: Exclude<RangePreset, 'custom'>, today: Date): StatsRange => {
  const to = toLocalDateKey(today)

  if (preset === 'thisMonth') {
    return { from: toLocalDateKey(new Date(today.getFullYear(), today.getMonth(), 1)), to }
  }

  return { from: toLocalDateKey(daysBefore(today, preset === 'last7' ? 6 : 29)), to }
}

export const rangeError = ({ from, to }: StatsRange): string | null => {
  if (!from || !to) return 'Tria les dues dates.'
  if (from > to) return "La data d'inici no pot ser posterior a la final."
  if ((Date.parse(to) - Date.parse(from)) / DAY_MS > MAX_DAYS) {
    return 'Tria un període de com a màxim un any.'
  }

  return null
}

export const formatDayLabel = (dateKey: string): string => {
  const [, month, day] = dateKey.split('-')

  return `${Number(day)}/${Number(month)}`
}

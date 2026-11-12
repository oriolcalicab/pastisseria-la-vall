import type { RangePreset } from '../types/stats'

type PresetOption = {
  preset: Exclude<RangePreset, 'custom'>
  label: string
}

export const rangePresets: PresetOption[] = [
  { preset: 'last7', label: 'Últims 7 dies' },
  { preset: 'last30', label: 'Últims 30 dies' },
  { preset: 'thisMonth', label: 'Aquest mes' },
]

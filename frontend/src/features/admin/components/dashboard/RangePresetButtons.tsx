import { rangePresets } from '../../data/rangePresets'
import { useDashboard } from '../../hooks/useDashboard'

const RangePresetButtons = () => {
  const { preset, selectPreset } = useDashboard()

  return (
    <div role="group" aria-label="Període" className="flex flex-wrap gap-2">
      {rangePresets.map((option) => {
        const isActive = preset === option.preset

        return (
          <button
            key={option.preset}
            type="button"
            aria-pressed={isActive}
            onClick={() => selectPreset(option.preset)}
            className={`chip focus-visible:ring-2 focus-visible:ring-caramel ${isActive ? 'chip-active' : ''}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default RangePresetButtons

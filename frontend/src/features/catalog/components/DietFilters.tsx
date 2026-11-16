import { dietOptions } from '../data/dietOptions'
import type { Diet } from '../types/product'

type DietFiltersProps = {
  selected: Diet[]
  onChange: (diet: Diet, isSelected: boolean) => void
  onClear: () => void
}

const DietFilters = ({ selected, onChange, onClear }: DietFiltersProps) => {
  const isShowingAll = selected.length === 0

  return (
    <fieldset>
      <legend className="sr-only">Filtra per dieta</legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onClear}
          aria-pressed={isShowingAll}
          className={`chip ${isShowingAll ? 'chip-active' : ''}`}
        >
          Tots
        </button>
        {dietOptions.map(({ diet, label }) => {
          const isSelected = selected.includes(diet)

          return (
            <label key={diet} className={`chip ${isSelected ? 'chip-active' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(event) => onChange(diet, event.target.checked)}
                className="sr-only"
              />
              {label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default DietFilters

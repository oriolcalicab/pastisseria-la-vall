import type { Diet } from '../types/product'

const options: { diet: Diet; label: string }[] = [
  { diet: 'gluten_free', label: 'Sense gluten' },
  { diet: 'plant_milk', label: 'Amb llet vegetal' },
  { diet: 'vegan', label: 'Vegà' },
]

type DietFiltersProps = {
  selected: Diet[]
  onChange: (diet: Diet, isSelected: boolean) => void
}

const DietFilters = ({ selected, onChange }: DietFiltersProps) => (
  <fieldset>
    <legend className="font-medium">Filtra per dieta</legend>
    <div className="mt-2 flex flex-wrap gap-4">
      {options.map(({ diet, label }) => (
        <label key={diet} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(diet)}
            onChange={(event) => onChange(diet, event.target.checked)}
          />
          {label}
        </label>
      ))}
    </div>
  </fieldset>
)

export default DietFilters
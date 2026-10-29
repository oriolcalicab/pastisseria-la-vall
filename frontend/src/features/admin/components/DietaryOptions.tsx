import type { ProductFlag, ProductFormValues } from '../types/productForm'

const options: { flag: ProductFlag; label: string }[] = [
  { flag: 'isGlutenFree', label: 'Sense gluten' },
  { flag: 'isPlantMilk', label: 'Amb llet vegetal' },
  { flag: 'isVegan', label: 'Vegà' },
]

type DietaryOptionsProps = {
  values: Pick<ProductFormValues, ProductFlag>
  onChange: (flag: ProductFlag, value: boolean) => void
}

const DietaryOptions = ({ values, onChange }: DietaryOptionsProps) => (
  <fieldset>
    <legend className="font-medium">Etiquetes dietètiques</legend>
    <div className="mt-2 flex flex-wrap gap-4">
      {options.map(({ flag, label }) => (
        <label key={flag} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values[flag]}
            onChange={(event) => onChange(flag, event.target.checked)}
          />
          {label}
        </label>
      ))}
    </div>
  </fieldset>
)

export default DietaryOptions
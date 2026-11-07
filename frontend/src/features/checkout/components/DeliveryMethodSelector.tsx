import type { DeliveryMethod } from '../types/checkout'

const options: { method: DeliveryMethod; label: string; description: string }[] = [
  {
    method: 'delivery',
    label: 'Lliurament a domicili',
    description: 'Te la portem a casa, a Barcelona.',
  },
  {
    method: 'pickup',
    label: 'Recollida en un punt',
    description: 'La recolleixes en una de les nostres botigues.',
  },
]

type DeliveryMethodSelectorProps = {
  value: DeliveryMethod | null
  onChange: (method: DeliveryMethod) => void
}

const DeliveryMethodSelector = ({ value, onChange }: DeliveryMethodSelectorProps) => (
  <fieldset>
    <legend className="font-medium">Com vols rebre la comanda?</legend>
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = option.method === value

        return (
          <label
            key={option.method}
            className={`flex cursor-pointer gap-3 rounded-sm border p-3 ${
              isSelected ? 'border-gray-900 bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="deliveryMethod"
              value={option.method}
              checked={isSelected}
              onChange={() => onChange(option.method)}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold">{option.label}</span>
              <span className="block text-sm text-gray-600">{option.description}</span>
            </span>
          </label>
        )
      })}
    </div>
  </fieldset>
)

export default DeliveryMethodSelector

import type { PickupPoint } from '../types/pickupPoint'

type PickupPointListProps = {
  points: PickupPoint[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const PickupPointList = ({ points, selectedId, onSelect }: PickupPointListProps) => (
  <fieldset>
    <legend className="sr-only">Tria un punt de recollida</legend>
    <div className="space-y-2">
      {points.map((point) => {
        const isSelected = point.id === selectedId

        return (
          <label
            key={point.id}
            className={`flex cursor-pointer gap-3 rounded-sm border p-3 ${
              isSelected ? 'border-gray-900 bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="pickupPoint"
              value={point.id}
              checked={isSelected}
              onChange={() => onSelect(point.id)}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold">{point.name}</span>
              <span className="block text-sm">
                {point.address}, {point.city}
              </span>
              <span className="block text-sm text-gray-600">{point.openingHours}</span>
            </span>
          </label>
        )
      })}
    </div>
  </fieldset>
)

export default PickupPointList
import { usePickupPoints } from '../hooks/usePickupPoints'
import type { PickupPoint } from '../types/pickupPoint'
import PickupMap from './PickupMap'
import PickupPointList from './PickupPointList'

type PickupPointsProps = {
  selectedId: number | null
  onSelect: (point: PickupPoint) => void
}

const PickupPoints = ({ selectedId, onSelect }: PickupPointsProps) => {
  const pickupPoints = usePickupPoints()

  const points = pickupPoints.status === 'success' ? pickupPoints.points : []

  const handleSelect = (id: number) => {
    const point = points.find((item) => item.id === id)

    if (point) onSelect(point)
  }

  return (
    <>
      <section aria-labelledby="pickup-title" className="md:col-start-1">
        <h3 id="pickup-title" className="text-lg font-semibold">
          Punts de recollida
        </h3>

        {pickupPoints.status === 'loading' && (
          <p role="status" className="mt-2">
            Carregant els punts de recollida...
          </p>
        )}

        {pickupPoints.status === 'error' && (
          <div role="alert" className="mt-2">
            <p className="text-red-600">No s'han pogut carregar els punts de recollida.</p>
            <button
              type="button"
              onClick={pickupPoints.retry}
              className="btn btn-outline btn-sm mt-2"
            >
              Torna-ho a provar
            </button>
          </div>
        )}

        {pickupPoints.status === 'success' && (
          <div className="mt-3">
            <PickupMap points={points} selectedId={selectedId} onSelect={handleSelect} />
          </div>
        )}
      </section>

      {pickupPoints.status === 'success' && (
        <section aria-labelledby="pickup-list-title" className="md:col-start-2">
          <h3 id="pickup-list-title" className="text-lg font-semibold">
            Tria la botiga
          </h3>
          <div className="mt-3">
            <PickupPointList points={points} selectedId={selectedId} onSelect={handleSelect} />
          </div>
        </section>
      )}
    </>
  )
}

export default PickupPoints

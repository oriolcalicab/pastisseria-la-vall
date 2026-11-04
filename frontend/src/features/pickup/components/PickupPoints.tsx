import { usePickupPoints } from '../hooks/usePickupPoints'
import PickupMap from './PickupMap'

const PickupPoints = () => {
  const pickupPoints = usePickupPoints()

  return (
    <section aria-labelledby="pickup-title" className="mt-6">
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
            className="mt-2 rounded-sm border px-3 py-1"
          >
            Torna-ho a provar
          </button>
        </div>
      )}

      {pickupPoints.status === 'success' && (
        <div className="mt-2">
          <PickupMap points={pickupPoints.points} />
        </div>
      )}
    </section>
  )
}

export default PickupPoints
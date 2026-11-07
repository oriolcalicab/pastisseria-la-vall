import { Link } from 'react-router-dom'
import type { OrderRequestError } from '../services/checkoutApi'

type OrderErrorNoticeProps = {
  error: OrderRequestError
  onChangeDate: () => void
  onChangePickupPoint: () => void
}

const OrderErrorNotice = ({ error, onChangeDate, onChangePickupPoint }: OrderErrorNoticeProps) => (
  <div role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 p-4">
    <p className="text-red-700">{error.message}</p>

    {error.reason === 'date_unavailable' && (
      <button type="button" onClick={onChangeDate} className="mt-2 underline">
        Tria una altra data
      </button>
    )}

    {error.reason === 'pickup_point_unavailable' && (
      <button type="button" onClick={onChangePickupPoint} className="mt-2 underline">
        Tria un altre punt de recollida
      </button>
    )}

    {error.reason === 'cart_changed' && (
      <Link to="/carreto" className="mt-2 inline-block underline">
        Revisa el carretó
      </Link>
    )}
  </div>
)

export default OrderErrorNotice

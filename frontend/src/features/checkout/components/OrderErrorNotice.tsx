import { Link } from 'react-router-dom'
import type { OrderRequestError } from '../services/checkoutApi'

type OrderErrorNoticeProps = {
  error: OrderRequestError
  onChangeDate: () => void
  onChangePickupPoint: () => void
}

const OrderErrorNotice = ({ error, onChangeDate, onChangePickupPoint }: OrderErrorNoticeProps) => (
  <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
    <p className="text-red-800">{error.message}</p>

    {error.reason === 'date_unavailable' && (
      <button type="button" onClick={onChangeDate} className="btn btn-outline btn-sm mt-3">
        Tria una altra data
      </button>
    )}

    {error.reason === 'pickup_point_unavailable' && (
      <button type="button" onClick={onChangePickupPoint} className="btn btn-outline btn-sm mt-3">
        Tria un altre punt de recollida
      </button>
    )}

    {error.reason === 'cart_changed' && (
      <Link to="/carreto" className="btn btn-outline btn-sm mt-3">
        Revisa el carretó
      </Link>
    )}
  </div>
)

export default OrderErrorNotice

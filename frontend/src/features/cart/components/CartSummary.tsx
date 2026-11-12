import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { formatUnitCount } from '../utils/unitCount'

type CartSummaryProps = {
  itemCount: number
  totalCents: number
}

const CartSummary = ({ itemCount, totalCents }: CartSummaryProps) => (
  <aside
    aria-labelledby="cart-summary-title"
    className="rounded-2xl border border-line bg-white p-6"
  >
    <h2 id="cart-summary-title" className="text-3xl">
      La teva comanda
    </h2>
    <div className="mt-3 flex justify-between border-b border-line pb-3 text-sm text-mocha">
      <span>{formatUnitCount(itemCount)}</span>
      <span>IVA inclòs</span>
    </div>
    <p className="mt-4 font-display text-3xl">Subtotal: {formatPrice(totalCents)}</p>
    <p className="mt-2 text-sm text-mocha">L’enviament es calcula al checkout.</p>
    <Link to="/checkout" className="btn btn-primary mt-6 w-full">
      Tramita la comanda
    </Link>
  </aside>
)

export default CartSummary

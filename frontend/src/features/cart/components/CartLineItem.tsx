import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { getProductImageUrl } from '../../catalog/utils/productImage'
import type { CartLine } from '../types/cart'
import QuantityStepper from './QuantityStepper'

type CartLineItemProps = {
  line: CartLine
  onQuantityChange: (variantId: number, quantity: number) => void
  onRemove: (variantId: number) => void
}

const CartLineItem = ({ line, onQuantityChange, onRemove }: CartLineItemProps) => {
  const label = `${line.productName}, ${line.variantName}`

  return (
    <li className="grid grid-cols-[76px_1fr] gap-x-3 gap-y-3 border-b border-line py-5 sm:grid-cols-[110px_1fr_auto_auto] sm:items-center sm:gap-5">
      <img
        src={getProductImageUrl(line.imageUrl)}
        alt=""
        className="aspect-square w-full rounded-xl bg-nata object-cover"
      />
      <div>
        <Link
          to={`/productes/${line.productId}`}
          className="font-display text-2xl leading-tight transition-colors hover:text-caramel"
        >
          {line.productName}
        </Link>
        <p className="text-sm text-mocha">
          {line.variantName} · {formatPrice(line.priceCents)} / unitat
        </p>
        <button
          type="button"
          onClick={() => onRemove(line.variantId)}
          aria-label={`Elimina ${label}`}
          className="mt-1 text-sm text-mocha underline transition-colors hover:text-caramel"
        >
          Elimina
        </button>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-auto sm:contents">
        <QuantityStepper
          label={label}
          quantity={line.quantity}
          onDecrease={() => onQuantityChange(line.variantId, line.quantity - 1)}
          onIncrease={() => onQuantityChange(line.variantId, line.quantity + 1)}
        />
        <p className="font-medium sm:w-24 sm:text-right">
          {formatPrice(line.priceCents * line.quantity)}
        </p>
      </div>
    </li>
  )
}

export default CartLineItem

import { Link } from 'react-router-dom'
import { formatPrice } from '../../../lib/formatPrice'
import { getProductImageUrl } from '../../catalog/utils/productImage'
import type { CartLine } from '../types/cart'

type CartLineItemProps = {
  line: CartLine
  onQuantityChange: (variantId: number, quantity: number) => void
  onRemove: (variantId: number) => void
}

const CartLineItem = ({ line, onQuantityChange, onRemove }: CartLineItemProps) => {
  const label = `${line.productName}, ${line.variantName}`

  return (
    <li className="flex flex-wrap items-center gap-4 border-t py-4">
      <img
        src={getProductImageUrl(line.imageUrl)}
        alt=""
        className="h-20 w-20 rounded object-cover"
      />

      <div className="min-w-40 flex-1">
        <Link to={`/productes/${line.productId}`} className="font-semibold underline">
          {line.productName}
        </Link>
        <p className="text-sm text-gray-600">{line.variantName}</p>
        <p className="text-sm">{formatPrice(line.priceCents)} / unitat</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuantityChange(line.variantId, line.quantity - 1)}
          disabled={line.quantity <= 1}
          aria-label={`Treu una unitat de ${label}`}
          className="h-8 w-8 rounded border disabled:opacity-50"
        >
          −
        </button>
        <span aria-label={`Quantitat de ${label}`}>{line.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(line.variantId, line.quantity + 1)}
          aria-label={`Afegeix una unitat de ${label}`}
          className="h-8 w-8 rounded border"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-semibold">
        {formatPrice(line.priceCents * line.quantity)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(line.variantId)}
        aria-label={`Elimina ${label}`}
        className="text-sm text-red-700 underline"
      >
        Elimina
      </button>
    </li>
  )
}

export default CartLineItem
import { Link } from 'react-router-dom'
import CartLineItem from '../../features/cart/components/CartLineItem'
import { useCart } from '../../features/cart/hooks/useCart'
import { formatPrice } from '../../lib/formatPrice'

const CartPage = () => {
  const { lines, totalCents, setQuantity, removeItem } = useCart()

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">El teu carretó</h1>

      {lines.length === 0 ? (
        <div className="mt-6">
          <p>El teu carretó està buit.</p>
          <Link to="/productes" className="mt-4 inline-block underline">
            Veure els productes
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6">
            {lines.map((line) => (
              <CartLineItem
                key={line.variantId}
                line={line}
                onQuantityChange={setQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>

          <p className="border-t pt-4 text-right text-xl font-bold">
            Total: {formatPrice(totalCents)}
          </p>
        </>
      )}
    </main>
  )
}

export default CartPage
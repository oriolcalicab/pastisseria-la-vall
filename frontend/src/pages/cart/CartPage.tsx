import { Link } from 'react-router-dom'
import CartLineItem from '../../features/cart/components/CartLineItem'
import { useCart } from '../../features/cart/hooks/useCart'
import { useCartValidation } from '../../features/cart/hooks/useCartValidation'
import { formatPrice } from '../../lib/formatPrice'

const CartPage = () => {
  const { lines, totalCents, setQuantity, removeItem } = useCart()
  const { notices, hasFailed } = useCartValidation()

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">El teu carretó</h1>

      {notices.length > 0 && (
        <ul
          role="alert"
          className="mt-4 space-y-1 rounded border border-yellow-300 bg-yellow-50 p-4"
        >
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      )}

      {hasFailed && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          No s'ha pogut comprovar el carretó. Els preus i l'stock podrien no estar actualitzats.
        </p>
      )}

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
          <div className="mt-4 text-right">
            <Link
              to="/checkout"
              className="inline-block rounded-sm bg-gray-900 px-4 py-2 text-white"
            >
              Tramita la comanda
            </Link>
          </div>
        </>
      )}
    </main>
  )
}

export default CartPage

import { Link } from 'react-router-dom'
import CartLineItem from '../../features/cart/components/CartLineItem'
import CartNotices from '../../features/cart/components/CartNotices'
import CartSummary from '../../features/cart/components/CartSummary'
import EmptyCart from '../../features/cart/components/EmptyCart'
import { useCart } from '../../features/cart/hooks/useCart'
import { useCartValidation } from '../../features/cart/hooks/useCartValidation'
import { formatUnitCount } from '../../features/cart/utils/unitCount'
import { formatProductCount } from '../../features/catalog/utils/productCount'

const CartPage = () => {
  const { lines, itemCount, totalCents, setQuantity, removeItem } = useCart()
  const { notices, hasFailed } = useCartValidation()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
      <CartNotices notices={notices} hasFailed={hasFailed} />

      {lines.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <p className="eyebrow">Gairebé a taula</p>
          <h1 className="page-title mt-3">El teu carretó</h1>
          <p className="mt-3 text-mocha">
            {formatProductCount(lines.length)} · {formatUnitCount(itemCount)} per compartir.
          </p>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-14">
            <div>
              <ul className="border-t border-line">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.variantId}
                    line={line}
                    onQuantityChange={setQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </ul>
              <Link
                to="/productes"
                className="mt-5 inline-block text-sm text-mocha underline transition-colors hover:text-caramel"
              >
                ← Continuar comprant
              </Link>
            </div>
            <CartSummary itemCount={itemCount} totalCents={totalCents} />
          </div>
        </>
      )}
    </main>
  )
}

export default CartPage

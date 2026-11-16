import { formatPrice } from '../../../../lib/formatPrice'
import { useLoadedStats } from '../../hooks/useDashboard'

const TopProducts = () => {
  const { topProducts } = useLoadedStats()

  return (
    <section aria-labelledby="top-products-title" className="card">
      <h2 id="top-products-title" className="font-medium">
        Productes més venuts
      </h2>

      {topProducts.length === 0 ? (
        <p className="mt-3 text-sm text-mocha">
          Encara no s'ha venut cap producte en aquestes dates.
        </p>
      ) : (
        <ol className="mt-3 space-y-2 text-sm">
          {topProducts.map((product, index) => (
            <li key={product.productName} className="grid grid-cols-[1.5rem_1fr_auto_auto] gap-3">
              <span className="text-caramel">{index + 1}</span>
              <span>{product.productName}</span>
              <span className="text-mocha">{product.quantity} u.</span>
              <span>{formatPrice(product.revenueCents)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default TopProducts

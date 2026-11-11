import { Link } from 'react-router-dom'
import ProductCard from '../../catalog/components/ProductCard'
import { useProducts } from '../../catalog/hooks/useProducts'

const FEATURED_COUNT = 4

const FeaturedProducts = () => {
  const products = useProducts({ page: 1, diet: '' })

  return (
    <section className="mx-auto max-w-6xl px-4 py-11 md:px-8 md:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="section-title">Els preferits de casa</h2>
        <Link to="/productes" className="font-medium text-caramel">
          Tots els productes →
        </Link>
      </div>

      <div className="mt-7">
        {products.status === 'loading' && <p>Carregant productes...</p>}
        {products.status === 'error' && (
          <div className="flex flex-wrap items-center gap-4">
            <p>No hem pogut carregar els productes.</p>
            <button type="button" onClick={products.retry} className="btn btn-outline btn-sm">
              Torna-ho a provar
            </button>
          </div>
        )}
        {products.status === 'success' && (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.data.items.slice(0, FEATURED_COUNT).map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-sm text-mocha">
        La llet vegetal no implica que sigui vegà. Treballem en un obrador compartit: hi pot haver
        traces d’al·lèrgens.
      </p>
    </section>
  )
}

export default FeaturedProducts

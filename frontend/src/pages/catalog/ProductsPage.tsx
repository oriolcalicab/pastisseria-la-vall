import { useState } from 'react'
import Pagination from '../../components/Pagination'
import DietFilters from '../../features/catalog/components/DietFilters'
import ProductCard from '../../features/catalog/components/ProductCard'
import { useProducts } from '../../features/catalog/hooks/useProducts'
import type { Diet } from '../../features/catalog/types/product'

const ProductsPage = () => {
  const [page, setPage] = useState(1)
  const [diets, setDiets] = useState<Diet[]>([])
  const products = useProducts({ page, diet: diets.join(',') })

  const handleDietChange = (diet: Diet, isSelected: boolean) => {
    setDiets((current) =>
      isSelected ? [...current, diet] : current.filter((item) => item !== diet),
    )
    setPage(1)
  }

  const clearDiets = () => {
    setDiets([])
    setPage(1)
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Els nostres productes</h1>

      <div className="mt-6">
        <DietFilters selected={diets} onChange={handleDietChange} />
      </div>

      <div className="mt-6">
        {products.status === 'loading' && <p role="status">Carregant productes...</p>}

        {products.status === 'error' && (
          <div role="alert">
            <p className="text-red-600">No s'han pogut carregar els productes.</p>
            <button
              type="button"
              onClick={products.retry}
              className="mt-2 rounded border px-3 py-1"
            >
              Torna-ho a provar
            </button>
          </div>
        )}

        {products.status === 'success' && products.data.items.length === 0 && (
          <>
            {diets.length > 0 ? (
              <div>
                <p>No hi ha cap producte amb aquests filtres.</p>
                <button
                  type="button"
                  onClick={clearDiets}
                  className="mt-2 rounded border px-3 py-1"
                >
                  Treu els filtres
                </button>
              </div>
            ) : (
              <p>De moment no hi ha cap producte disponible.</p>
            )}
          </>
        )}

        {products.status === 'success' && products.data.items.length > 0 && (
          <>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.data.items.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
            <Pagination
              page={products.data.page}
              totalPages={products.data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default ProductsPage
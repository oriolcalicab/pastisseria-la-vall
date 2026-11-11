import { useState } from 'react'
import Pagination from '../../components/Pagination'
import DietFilters from '../../features/catalog/components/DietFilters'
import ProductGrid from '../../features/catalog/components/ProductGrid'
import { useProducts } from '../../features/catalog/hooks/useProducts'
import type { Diet } from '../../features/catalog/types/product'
import { formatProductCount } from '../../features/catalog/utils/productCount'

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
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
      <p className="eyebrow">Fet a mà. Per compartir.</p>
      <h1 className="page-title mt-3">Productes</h1>
      <p className="mt-3 max-w-xl text-mocha">
        Pastissos i cupcakes de l’obrador. Tria el teu petit gran moment.
      </p>

      <div className="mt-8">
        <DietFilters selected={diets} onChange={handleDietChange} onClear={clearDiets} />
      </div>

      <div className="mt-6">
        {products.status === 'loading' && <p role="status">Carregant productes...</p>}

        {products.status === 'error' && (
          <div role="alert" className="flex flex-wrap items-center gap-4">
            <p className="text-red-700">No s'han pogut carregar els productes.</p>
            <button type="button" onClick={products.retry} className="btn btn-outline btn-sm">
              Torna-ho a provar
            </button>
          </div>
        )}

        {products.status === 'success' && products.data.items.length === 0 && (
          <>
            {diets.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                <p>No hi ha cap producte amb aquests filtres.</p>
                <button type="button" onClick={clearDiets} className="btn btn-outline btn-sm">
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
            <p className="mb-5 text-sm text-mocha">{formatProductCount(products.data.total)}</p>
            <ProductGrid products={products.data.items} />
            <Pagination
              page={products.data.page}
              totalPages={products.data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <p className="mt-10 text-sm text-mocha">
        Cada etiqueta correspon a la recepta indicada. Obrador compartit amb gluten, ous, llet i
        fruits de closca. Consulta els al·lèrgens a la fitxa de cada producte.
      </p>
    </main>
  )
}

export default ProductsPage

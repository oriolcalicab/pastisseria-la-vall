import { Link, useParams } from 'react-router-dom'
import ProductDetail from '../../features/catalog/components/ProductDetail'
import { useProduct } from '../../features/catalog/hooks/useProduct'
import NotFoundPage from '../errors/NotFoundPage'

const ProductDetailPage = () => {
  const { id = '' } = useParams()
  const product = useProduct(id)

  if (product.status === 'not-found') return <NotFoundPage />

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <Link to="/productes" className="text-sm text-mocha transition-colors hover:text-caramel">
        « Torna als productes
      </Link>

      {product.status === 'loading' && (
        <p role="status" className="mt-6">
          Carregant el producte...
        </p>
      )}

      {product.status === 'error' && (
        <div role="alert" className="mt-6 flex flex-wrap items-center gap-4">
          <p className="text-red-700">No s'ha pogut carregar el producte.</p>
          <button type="button" onClick={product.retry} className="btn btn-outline btn-sm">
            Torna-ho a provar
          </button>
        </div>
      )}

      {product.status === 'success' && (
        <ProductDetail key={product.product.id} product={product.product} />
      )}
    </main>
  )
}

export default ProductDetailPage

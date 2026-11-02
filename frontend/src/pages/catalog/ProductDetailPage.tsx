import { Link, useParams } from 'react-router-dom'
import ProductDetail from '../../features/catalog/components/ProductDetail'
import { useProduct } from '../../features/catalog/hooks/useProduct'
import NotFoundPage from '../errors/NotFoundPage'

const ProductDetailPage = () => {
  const { id = '' } = useParams()
  const product = useProduct(id)
  
  if (product.status === 'not-found') return <NotFoundPage />

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <Link to="/productes" className="text-sm underline">
        « Torna als productes
      </Link>

      {product.status === 'loading' && (
        <p role="status" className="mt-6">
          Carregant el producte...
        </p>
      )}

      {product.status === 'error' && (
        <div role="alert" className="mt-6">
          <p className="text-red-600">No s'ha pogut carregar el producte.</p>
          <button type="button" onClick={product.retry} className="mt-2 rounded border px-3 py-1">
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
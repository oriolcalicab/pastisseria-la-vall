import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../features/admin/components/ProductForm'
import { useAdminProduct } from '../../features/admin/hooks/useAdminProduct'
import { useProductForm } from '../../features/admin/hooks/useProductForm'
import { updateAdminProduct } from '../../features/admin/services/adminProductsApi'
import type { AdminProductDetail } from '../../features/admin/types/product'
import { toProductFormValues } from '../../features/admin/utils/productForm'
import NotFoundPage from '../errors/NotFoundPage'

type EditProductFormProps = {
  product: AdminProductDetail
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const navigate = useNavigate()
  const form = useProductForm(
    (saved) =>
      navigate('/admin/productes', {
        state: { notice: `Producte "${saved.name}" desat correctament` },
      }),
    {
      initialValues: toProductFormValues(product),
      save: (token, values) => updateAdminProduct(token, product.id, values),
      errorMessage: "No s'ha pogut desar el producte",
    },
  )

  return <ProductForm form={form} />
}

const EditProductPage = () => {
  const { id = '' } = useParams()
  const product = useAdminProduct(id)

  if (product.status === 'not-found') return <NotFoundPage />

  return (
    <>
      <Link to="/admin/productes" className="text-sm underline">
        « Torna als productes
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Edita el producte</h1>

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

      {product.status === 'success' && <EditProductForm product={product.product} />}
    </>
  )
}

export default EditProductPage

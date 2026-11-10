import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../features/admin/components/ProductForm'
import { useProductForm } from '../../features/admin/hooks/useProductForm'

const NewProductPage = () => {
  const navigate = useNavigate()
  const form = useProductForm((product) =>
    navigate('/admin/productes', {
      state: { notice: `Producte "${product.name}" creat correctament` },
    }),
  )

  return (
    <>
      <Link to="/admin/productes" className="text-sm underline">
        « Torna als productes
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Nou producte</h1>
      <ProductForm form={form} />
    </>
  )
}

export default NewProductPage

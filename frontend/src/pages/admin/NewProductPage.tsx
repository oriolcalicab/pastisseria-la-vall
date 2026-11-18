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
      <Link to="/admin/productes" className="link text-sm">
        « Torna als productes
      </Link>
      <h1 className="page-title mt-2 font-display">Nou producte</h1>
      <ProductForm form={form} />
    </>
  )
}

export default NewProductPage

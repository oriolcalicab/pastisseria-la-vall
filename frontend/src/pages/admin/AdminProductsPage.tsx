import { useState } from 'react'
import Pagination from '../../features/admin/components/Pagination'
import ProductSearch from '../../features/admin/components/ProductSearch'
import ProductsTable from '../../features/admin/components/ProductsTable'
import { useAdminProducts } from '../../features/admin/hooks/useAdminProducts'

const AdminProductsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const products = useAdminProducts({ page, search })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Productes</h1>
        <ProductSearch initialValue={search} onSearch={handleSearch} />
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
          <p>
            {search
              ? `No hi ha cap producte que coincideixi amb "${search}".`
              : 'Encara no hi ha cap producte.'}
          </p>
        )}

        {products.status === 'success' && products.data.items.length > 0 && (
          <>
            <ProductsTable products={products.data.items} />
            <Pagination
              page={products.data.page}
              totalPages={products.data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  )
}

export default AdminProductsPage
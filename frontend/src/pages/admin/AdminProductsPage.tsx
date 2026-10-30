import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import ProductSearch from '../../features/admin/components/ProductSearch'
import ProductsTable from '../../features/admin/components/ProductsTable'
import { useAdminProducts } from '../../features/admin/hooks/useAdminProducts'
import { useActiveToggles } from '../../features/admin/hooks/useActiveToggles'

const readNotice = (state: unknown): string | null => {
  if (typeof state !== 'object' || state === null || !('notice' in state)) return null

  return typeof state.notice === 'string' ? state.notice : null
}

const AdminProductsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const products = useAdminProducts({ page, search })
  const location = useLocation()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(() => readNotice(location.state))
  const toggles = useActiveToggles({
    onProductChange: products.replaceProduct,
    onVariantChange: products.replaceVariant,
  })

  useEffect(() => {
    if (readNotice(location.state)) navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Productes</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ProductSearch initialValue={search} onSearch={handleSearch} />
          <Link
            to="/admin/productes/nou"
            className="rounded bg-gray-900 px-3 py-1 text-center text-white"
          >
            Nou producte
          </Link>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between rounded border border-green-300 bg-green-50 px-4 py-2 text-green-800"
        >
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice(null)} className="text-sm underline">
            Tanca
          </button>
        </div>
      )}

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
            {toggles.error && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {toggles.error}
              </p>
            )}
            <ProductsTable
              products={products.data.items}
              pendingKey={toggles.pendingKey}
              onToggleProduct={toggles.toggleProduct}
              onToggleVariant={toggles.toggleVariant}
            />
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

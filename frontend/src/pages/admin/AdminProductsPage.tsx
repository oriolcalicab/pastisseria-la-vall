import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import ProductSearch from '../../features/admin/components/ProductSearch'
import ProductsTable from '../../features/admin/components/ProductsTable'
import { useAdminProducts } from '../../features/admin/hooks/useAdminProducts'
import { useActiveToggles } from '../../features/admin/hooks/useActiveToggles'
import ProductFilters from '../../features/admin/components/ProductFilters'
import type { ProductStatusFilter } from '../../features/admin/types/product'

const readNotice = (state: unknown): string | null => {
  if (typeof state !== 'object' || state === null || !('notice' in state)) return null

  return typeof state.notice === 'string' ? state.notice : null
}

const AdminProductsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<ProductStatusFilter>('')
  const products = useAdminProducts({ page, search, categoryId, status })
  const location = useLocation()
  const hasFilters = Boolean(search || categoryId || status)
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

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setPage(1)
  }

  const handleStatusChange = (value: ProductStatusFilter) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title font-display">Productes</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ProductSearch initialValue={search} onSearch={handleSearch} />
          <Link to="/admin/productes/nou" className="btn btn-primary btn-sm">
            Nou producte
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <ProductFilters
          categoryId={categoryId}
          status={status}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
        />
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-green-900"
        >
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice(null)} className="text-sm underline">
            Tanca
          </button>
        </div>
      )}

      <div className="mt-6">
        {products.status === 'loading' && (
          <p role="status" className="text-mocha">
            Carregant productes...
          </p>
        )}

        {products.status === 'error' && (
          <div role="alert">
            <p className="text-red-700">No s'han pogut carregar els productes.</p>
            <button type="button" onClick={products.retry} className="btn btn-outline btn-sm mt-3">
              Torna-ho a provar
            </button>
          </div>
        )}

        {products.status === 'success' && products.data.items.length === 0 && (
          <p className="text-mocha">
            {hasFilters
              ? 'No hi ha cap producte amb aquesta cerca o aquests filtres.'
              : 'Encara no hi ha cap producte.'}
          </p>
        )}

        {products.status === 'success' && products.data.items.length > 0 && (
          <>
            {toggles.error && (
              <p role="alert" className="mb-4 text-sm text-red-700">
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

import { useState } from 'react'
import Pagination from '../../components/Pagination'
import AdminOrdersTable from '../../features/admin/components/AdminOrdersTable'
import OrderStatusFilter from '../../features/admin/components/OrderStatusFilter'
import { useAdminOrders } from '../../features/admin/hooks/useAdminOrders'
import type { StatusFilter } from '../../features/admin/types/order'

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<StatusFilter>('')
  const orders = useAdminOrders({ page, status })

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Comandes</h1>
        <OrderStatusFilter value={status} onChange={handleStatusChange} />
      </div>

      <div className="mt-6">
        {orders.status === 'loading' && <p role="status">Carregant comandes...</p>}

        {orders.status === 'error' && (
          <div role="alert">
            <p className="text-red-600">No s'han pogut carregar les comandes.</p>
            <button type="button" onClick={orders.retry} className="mt-2 rounded border px-3 py-1">
              Torna-ho a provar
            </button>
          </div>
        )}

        {orders.status === 'success' && orders.data.items.length === 0 && (
          <p>
            {status ? 'No hi ha cap comanda amb aquest estat.' : 'Encara no hi ha cap comanda.'}
          </p>
        )}

        {orders.status === 'success' && orders.data.items.length > 0 && (
          <>
            <AdminOrdersTable orders={orders.data.items} />
            <Pagination
              page={orders.data.page}
              totalPages={orders.data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  )
}

export default AdminOrdersPage

import { useDashboard } from '../../hooks/useDashboard'
import { totalOrders } from '../../utils/statsFigures'
import DeliveryMethodsBar from './DeliveryMethodsBar'
import OrdersByStatus from './OrdersByStatus'
import SalesByDayChart from './SalesByDayChart'
import StatsCards from './StatsCards'
import TopProducts from './TopProducts'

const DashboardContent = () => {
  const { stats } = useDashboard()

  if (stats.status === 'loading') {
    return (
      <p role="status" className="mt-8 text-mocha">
        Carregant les dades...
      </p>
    )
  }

  if (stats.status === 'error') {
    return (
      <div role="alert" className="mt-8">
        <p>No hem pogut carregar les dades del tauler.</p>
        <button type="button" onClick={stats.retry} className="btn btn-outline btn-sm mt-3">
          Torna-ho a provar
        </button>
      </div>
    )
  }

  if (totalOrders(stats.stats) === 0) {
    return <p className="mt-8 text-mocha">Encara no hi ha comandes en aquestes dates.</p>
  }

  return (
    <div className="mt-8 space-y-4">
      <StatsCards />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesByDayChart />
        </div>
        <OrdersByStatus />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DeliveryMethodsBar />
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
      </div>
    </div>
  )
}

export default DashboardContent

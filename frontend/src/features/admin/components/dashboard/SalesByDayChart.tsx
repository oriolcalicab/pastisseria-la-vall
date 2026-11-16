import { useState } from 'react'
import { useLoadedStats } from '../../hooks/useDashboard'
import SalesBarChart from './SalesBarChart'
import SalesTable from './SalesTable'

const SalesByDayChart = () => {
  const { salesByDay } = useLoadedStats()
  const [showTable, setShowTable] = useState(false)

  return (
    <section aria-labelledby="sales-by-day-title" className="card">
      <div className="flex items-center justify-between gap-3">
        <h2 id="sales-by-day-title" className="font-medium">
          Vendes per dia
        </h2>
        <button
          type="button"
          aria-expanded={showTable}
          aria-controls="sales-by-day-table"
          onClick={() => setShowTable((current) => !current)}
          className="text-sm text-caramel hover:underline"
        >
          {showTable ? 'Amaga la taula' : 'Veure com a taula'}
        </button>
      </div>

      <div
        role="img"
        aria-label="Gràfic de barres amb els ingressos de cada dia. Les mateixes dades són a la taula."
        className="mt-4"
      >
        <SalesBarChart days={salesByDay} />
      </div>

      <div id="sales-by-day-table" hidden={!showTable}>
        <SalesTable days={salesByDay} />
      </div>
    </section>
  )
}

export default SalesByDayChart

import { formatPrice } from '../../../../lib/formatPrice'
import type { DailySales } from '../../types/stats'
import { formatDayLabel } from '../../utils/dateRange'

type SalesTableProps = {
  days: DailySales[]
}

const SalesTable = ({ days }: SalesTableProps) => (
  <div className="mt-4 max-h-80 overflow-y-auto">
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Vendes de cada dia</caption>
      <thead className="text-mocha">
        <tr className="border-b border-line">
          <th scope="col" className="py-2 font-medium">
            Dia
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Comandes
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Ingressos
          </th>
        </tr>
      </thead>
      <tbody>
        {days.map((day) => (
          <tr key={day.date} className="border-b border-line last:border-0">
            <th scope="row" className="py-2 font-normal">
              {formatDayLabel(day.date)}
            </th>
            <td className="py-2 text-right">{day.orders}</td>
            <td className="py-2 text-right">{formatPrice(day.revenueCents)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default SalesTable

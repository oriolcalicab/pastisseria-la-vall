import { Link } from 'react-router-dom'
import { formatPrice } from '../../../../lib/formatPrice'
import { useLoadedStats } from '../../hooks/useDashboard'
import { averageOrderCents } from '../../utils/statsFigures'

const StatsCards = () => {
  const stats = useLoadedStats()

  const cards = [
    { label: 'Ingressos', value: formatPrice(stats.revenueCents) },
    { label: 'Comandes', value: String(stats.orderCount) },
    { label: 'Tiquet mitjà', value: formatPrice(averageOrderCents(stats)) },
    { label: 'Pendents', value: String(stats.ordersByStatus.pending) },
  ]

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card">
          <dt className="text-sm text-mocha">{card.label}</dt>
          <dd className="mt-1 font-display text-3xl">{card.value}</dd>
          {card.label === 'Pendents' && (
            <dd className="mt-1 text-sm">
              <Link to="/admin/comandes" className="text-caramel hover:underline">
                Veure les comandes
              </Link>
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

export default StatsCards

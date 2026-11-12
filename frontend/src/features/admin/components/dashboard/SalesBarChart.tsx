import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatPrice } from '../../../../lib/formatPrice'
import { chartColors } from '../../data/chartColors'
import type { DailySales } from '../../types/stats'
import { formatDayLabel } from '../../utils/dateRange'

type SalesBarChartProps = {
  days: DailySales[]
}

const tick = { fill: chartColors.text, fontSize: 12 }

const SalesBarChart = ({ days }: SalesBarChartProps) => (
  <ResponsiveContainer width="100%" height={240}>
    <BarChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
      <CartesianGrid vertical={false} stroke={chartColors.grid} />
      <XAxis
        dataKey="date"
        tickFormatter={formatDayLabel}
        tick={tick}
        tickLine={false}
        axisLine={{ stroke: chartColors.grid }}
        minTickGap={16}
      />
      <YAxis
        tickFormatter={(cents: number) => `${Math.round(cents / 100)} €`}
        tick={tick}
        tickLine={false}
        axisLine={false}
        width={56}
      />
      <Tooltip
        formatter={(value) => formatPrice(Number(value))}
        labelFormatter={(label) => formatDayLabel(String(label))}
        cursor={{ fill: chartColors.cursor }}
      />
      <Bar dataKey="revenueCents" name="Ingressos" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

export default SalesBarChart

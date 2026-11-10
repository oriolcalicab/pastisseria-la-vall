import { prisma } from '../lib/prisma.js'
import { getDeliveryDay, getMadridNowMs, getMonthDays } from '../utils/deliveryDates.js'
import { readNumberSetting } from '../utils/settings.js'
import { toDateKey } from '../utils/dateKey.js'

const DEFAULT_MIN_PREP_HOURS = 48
const DEFAULT_MAX_ORDERS_PER_DAY = 5

export const getDeliveryDates = async (month: string, now: Date) => {
  const days = getMonthDays(month)
  const firstDay = new Date(`${month}-01T00:00:00Z`)
  const lastDay = new Date(`${month}-${String(days.length).padStart(2, '0')}T00:00:00Z`)
  const range = { gte: firstDay, lte: lastDay }

  const [settings, closedDates, orderCounts] = await Promise.all([
    prisma.setting.findMany({ where: { key: { in: ['min_prep_hours', 'max_orders_per_day'] } } }),
    prisma.closedDate.findMany({ where: { date: range }, select: { date: true } }),
    prisma.order.groupBy({
      by: ['deliveryDate'],
      where: { deliveryDate: range, status: { not: 'cancelled' } },
      _count: { _all: true },
    }),
  ])

  const rules = {
    nowMs: getMadridNowMs(now),
    minPrepHours: readNumberSetting(settings, 'min_prep_hours', DEFAULT_MIN_PREP_HOURS),
    maxOrdersPerDay: readNumberSetting(settings, 'max_orders_per_day', DEFAULT_MAX_ORDERS_PER_DAY),
    closedDates: new Set(closedDates.map((closed) => toDateKey(closed.date))),
    orderCounts: new Map(orderCounts.map((row) => [toDateKey(row.deliveryDate), row._count._all])),
  }

  return { month, days: days.map((date) => getDeliveryDay(date, rules)) }
}

import type { DailySales, SoldOrder } from '../types/stats.js'
import { toDateKey } from './dateKey.js'

const DAY_MS = 24 * 60 * 60 * 1000

export const salesByDay = (orders: SoldOrder[], from: string, to: string): DailySales[] => {
  const days = new Map<string, DailySales>()
  const last = Date.parse(`${to}T00:00:00Z`)

  for (let time = Date.parse(`${from}T00:00:00Z`); time <= last; time += DAY_MS) {
    const date = toDateKey(new Date(time))
    days.set(date, { date, orders: 0, revenueCents: 0 })
  }

  for (const order of orders) {
    const day = days.get(toDateKey(order.createdAt))

    if (!day) continue

    day.orders += 1
    day.revenueCents += order.totalCents
  }

  return [...days.values()]
}

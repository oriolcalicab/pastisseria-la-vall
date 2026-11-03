import type { DayBlockReason, DeliveryDay, DeliveryRules } from '../types/delivery.js'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS
const SUNDAY = 0

const madridFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export const getMadridNowMs = (now: Date): number => {
  const parts = Object.fromEntries(
    madridFormatter.formatToParts(now).map((part) => [part.type, part.value]),
  )

  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  )
}

export const getCurrentMonth = (now: Date): string =>
  new Date(getMadridNowMs(now)).toISOString().slice(0, 7)

export const getMonthDays = (month: string): string[] => {
  const year = Number(month.slice(0, 4))
  const monthNumber = Number(month.slice(5, 7))
  const dayCount = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()

  return Array.from(
    { length: dayCount },
    (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`,
  )
}

const getBlockReason = (date: string, rules: DeliveryRules): DayBlockReason | null => {
  const dayStartMs = Date.parse(`${date}T00:00:00Z`)
  const todayStartMs = rules.nowMs - (rules.nowMs % DAY_MS)

  if (dayStartMs < todayStartMs) return 'past'
  if (dayStartMs - rules.nowMs < rules.minPrepHours * HOUR_MS) return 'too_soon'
  if (new Date(dayStartMs).getUTCDay() === SUNDAY) return 'sunday'
  if (rules.closedDates.has(date)) return 'closed'
  if ((rules.orderCounts.get(date) ?? 0) >= rules.maxOrdersPerDay) return 'full'

  return null
}

export const getDeliveryDay = (date: string, rules: DeliveryRules): DeliveryDay => {
  const reason = getBlockReason(date, rules)

  return { date, available: reason === null, reason }
}
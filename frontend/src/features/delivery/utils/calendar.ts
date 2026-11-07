import type { DayBlockReason } from '../types/delivery'

const DAY_MS = 24 * 60 * 60 * 1000

const monthFormatter = new Intl.DateTimeFormat('ca-ES', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const dayFormatter = new Intl.DateTimeFormat('ca-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const madridMonthFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
})

export const getCurrentMonth = (now: Date): string => {
  const parts = Object.fromEntries(
    madridMonthFormatter.formatToParts(now).map((part) => [part.type, part.value]),
  )

  return `${parts.year}-${parts.month}`
}

const toUtcDate = (date: string) => new Date(`${date}T00:00:00Z`)

const toDateKey = (date: Date) => date.toISOString().slice(0, 10)

export const getMonthOf = (date: string): string => date.slice(0, 7)

export const addMonths = (month: string, amount: number): string => {
  const date = toUtcDate(`${month}-01`)
  date.setUTCMonth(date.getUTCMonth() + amount)

  return getMonthOf(toDateKey(date))
}

export const addDays = (date: string, amount: number): string =>
  toDateKey(new Date(toUtcDate(date).getTime() + amount * DAY_MS))

export const getCalendarWeeks = (month: string): (string | null)[][] => {
  const firstDay = toUtcDate(`${month}-01`)
  const mondayOffset = (firstDay.getUTCDay() + 6) % 7
  const dayCount = new Date(
    Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0),
  ).getUTCDate()

  const cells: (string | null)[] = [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => addDays(`${month}-01`, index)),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
}

export const getMonthLabel = (month: string): string =>
  monthFormatter.format(toUtcDate(`${month}-01`))

export const getDayLabel = (date: string): string => dayFormatter.format(toUtcDate(date))

export const blockReasonLabels: Record<DayBlockReason, string> = {
  past: 'ja ha passat',
  too_soon: 'cal encarregar-ho amb 48 hores',
  sunday: 'els diumenges no fem lliuraments',
  closed: 'és festiu',
  full: 'no queden places',
}

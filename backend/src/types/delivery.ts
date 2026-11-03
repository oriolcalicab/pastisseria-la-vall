export type DayBlockReason = 'past' | 'too_soon' | 'sunday' | 'closed' | 'full'

export type DeliveryDay = {
  date: string
  available: boolean
  reason: DayBlockReason | null
}

export type DeliveryRules = {
  nowMs: number
  minPrepHours: number
  maxOrdersPerDay: number
  closedDates: Set<string>
  orderCounts: Map<string, number>
}
export type DayBlockReason = 'past' | 'too_soon' | 'sunday' | 'closed' | 'full'

export type DeliveryDay = {
  date: string
  available: boolean
  reason: DayBlockReason | null
}

export type DeliveryMonth = {
  month: string
  days: DeliveryDay[]
}
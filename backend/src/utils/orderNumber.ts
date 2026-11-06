import { randomUUID } from 'node:crypto'
import { getMadridNowMs } from './deliveryDates.js'

const SUFFIX_LENGTH = 6

export const createOrderNumber = (now: Date, suffix: string = randomUUID()): string => {
  const date = new Date(getMadridNowMs(now)).toISOString().slice(2, 10).replaceAll('-', '')
  const code = suffix.replaceAll('-', '').slice(0, SUFFIX_LENGTH).toUpperCase()

  return `LV-${date}-${code}`
}

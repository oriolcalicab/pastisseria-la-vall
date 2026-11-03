import { apiUrl } from '../../../lib/api'
import type { DeliveryMonth } from '../types/delivery'

export const fetchDeliveryDates = async (month: string): Promise<DeliveryMonth> => {
  const params = new URLSearchParams({ month })
  const response = await fetch(apiUrl(`/api/delivery-dates?${params}`))

  if (!response.ok) {
    throw new Error(`Delivery dates request failed with status ${response.status}`)
  }

  return response.json() as Promise<DeliveryMonth>
}
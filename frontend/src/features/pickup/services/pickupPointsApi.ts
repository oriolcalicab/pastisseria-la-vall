import { apiUrl } from '../../../lib/api'
import type { PickupPoint } from '../types/pickupPoint'

export const fetchPickupPoints = async (): Promise<PickupPoint[]> => {
  const response = await fetch(apiUrl('/api/pickup-points'))

  if (!response.ok) {
    throw new Error(`Pickup points request failed with status ${response.status}`)
  }

  return response.json() as Promise<PickupPoint[]>
}
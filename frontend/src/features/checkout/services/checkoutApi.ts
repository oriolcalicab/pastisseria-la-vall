import { apiUrl } from '../../../lib/api'

export const fetchShippingFee = async (): Promise<number> => {
  const response = await fetch(apiUrl('/api/checkout/shipping-fee'))

  if (!response.ok) {
    throw new Error(`Shipping fee request failed with status ${response.status}`)
  }

  const body = (await response.json()) as { shippingFeeCents: number }

  return body.shippingFeeCents
}
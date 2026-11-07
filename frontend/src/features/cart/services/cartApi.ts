import { apiUrl } from '../../../lib/api'
import type { CartLine, ValidatedCart } from '../types/cart'

export const validateCart = async (lines: CartLine[]): Promise<ValidatedCart> => {
  const requestedLines = lines.map(({ variantId, quantity, priceCents }) => ({
    variantId,
    quantity,
    priceCents,
  }))

  const response = await fetch(apiUrl('/api/cart/validate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: requestedLines }),
  })

  if (!response.ok) {
    throw new Error(`Cart validation failed with status ${response.status}`)
  }

  return response.json() as Promise<ValidatedCart>
}

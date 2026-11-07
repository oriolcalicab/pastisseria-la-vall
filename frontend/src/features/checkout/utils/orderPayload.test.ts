import { describe, expect, it } from 'vitest'
import type { CartLine } from '../../cart/types/cart'
import { buildOrderPayload } from './orderPayload'

const lines: CartLine[] = [
  {
    variantId: 12,
    productId: 7,
    productName: 'Pastís de xocolata',
    variantName: '6 racions',
    priceCents: 3900,
    imageUrl: null,
    quantity: 2,
  },
]

const address = { address: 'Carrer de Mallorca, 120', city: 'Barcelona', postalCode: '08036' }

const baseInput = {
  idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
  deliveryDate: '2026-11-12',
  pickupPointId: 2,
  address,
  lines,
}

describe('buildOrderPayload', () => {
  it('sends the pickup point and only what the backend needs of each line', () => {
    // Given a pickup with a point and an address that was written before
    // When the payload is built
    // Then only the point is sent
    expect(buildOrderPayload({ ...baseInput, method: 'pickup' })).toEqual({
      idempotencyKey: baseInput.idempotencyKey,
      deliveryDate: '2026-11-12',
      deliveryMethod: 'pickup',
      pickupPointId: 2,
      lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
    })
  })

  it('sends the address of a home delivery', () => {
    // Given a home delivery with a point that was chosen before
    // When the payload is built
    const payload = buildOrderPayload({ ...baseInput, method: 'delivery' })

    // Then only the address is sent
    expect(payload).toMatchObject({ deliveryMethod: 'delivery', shippingAddress: address })
    expect(payload).not.toHaveProperty('pickupPointId')
  })
})

import { describe, expect, it } from 'vitest'
import type { CartVariant } from '../types/cart.js'
import { buildOrderDraft } from './orderDraft.js'

const variant: CartVariant = {
  id: 12,
  name: '6 racions',
  priceCents: 3900,
  stock: 5,
  isActive: true,
  product: { id: 7, name: 'Pastís de xocolata', imageUrl: null, isActive: true },
}

const requested = [{ variantId: 12, quantity: 2, priceCents: 3900 }]

describe('buildOrderDraft', () => {
  it('prepares a home delivery with the prices of the database and the shipping fee', () => {
    // Given two units at 39,00 € and a shipping fee of 5,00 €
    // When the order is prepared
    // Then the lines copy the name and the price and the totals include the shipping
    expect(buildOrderDraft(requested, [variant], 'delivery', 500)).toEqual({
      ok: true,
      draft: {
        items: [
          {
            variantId: 12,
            productName: 'Pastís de xocolata',
            variantName: '6 racions',
            unitPriceCents: 3900,
            quantity: 2,
            lineTotalCents: 7800,
          },
        ],
        subtotalCents: 7800,
        shippingCents: 500,
        totalCents: 8300,
      },
    })
  })

  it('does not charge shipping for a pickup', () => {
    // Given a pickup
    // When the order is prepared
    const result = buildOrderDraft(requested, [variant], 'pickup', 500)

    // Then there is no shipping
    expect(result).toMatchObject({ ok: true, draft: { shippingCents: 0, totalCents: 7800 } })
  })

  it.each([
    ['the price changed', { ...variant, priceCents: 4200 }, 'price_changed'],
    ['there is not enough stock', { ...variant, stock: 1 }, 'quantity_reduced'],
    ['the variant is not active', { ...variant, isActive: false }, 'unavailable'],
  ])('rejects the order when %s', (_case, changedVariant, type) => {
    // Given a variant that changed since the customer saw it
    // When the order is prepared
    const result = buildOrderDraft(requested, [changedVariant], 'pickup', 500)

    // Then the order is rejected with the reason
    expect(result).toEqual({ ok: false, warnings: [{ variantId: 12, type }] })
  })
})

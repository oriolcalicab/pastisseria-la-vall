import { describe, expect, it } from 'vitest'
import type { CartVariant } from '../types/cart.js'
import { reconcileCart } from './reconcileCart.js'

const variant: CartVariant = {
  id: 12,
  name: '6 racions',
  priceCents: 3900,
  stock: 5,
  isActive: true,
  product: { id: 7, name: 'Pastís de xocolata', imageUrl: null, isActive: true },
}

const requested = { variantId: 12, quantity: 2, priceCents: 3900 }

const validLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

describe('reconcileCart', () => {
  it('keeps a correct line without warnings', () => {
    // Given a line that matches the database
    // When the cart is reconciled
    // Then nothing changes
    expect(reconcileCart([requested], [variant])).toEqual({
      lines: [validLine],
      warnings: [],
      totalCents: 7800,
    })
  })

  it.each([
    ['does not exist', []],
    ['is not active', [{ ...variant, isActive: false }]],
    [
      'belongs to an inactive product',
      [{ ...variant, product: { ...variant.product, isActive: false } }],
    ],
  ])('removes a variant that %s', (_case, variants) => {
    // Given a variant that can not be bought
    // When the cart is reconciled
    // Then the line is removed with a warning
    expect(reconcileCart([requested], variants)).toEqual({
      lines: [],
      warnings: [{ variantId: 12, type: 'unavailable' }],
      totalCents: 0,
    })
  })

  it('removes a variant without stock', () => {
    // Given a variant without stock
    // When the cart is reconciled
    const result = reconcileCart([requested], [{ ...variant, stock: 0 }])

    // Then the line is removed with a warning
    expect(result.lines).toEqual([])
    expect(result.warnings).toEqual([{ variantId: 12, type: 'out_of_stock' }])
  })

  it('reduces the quantity to the stock', () => {
    // Given more units than the stock
    // When the cart is reconciled
    const result = reconcileCart([{ ...requested, quantity: 9 }], [variant])

    // Then the quantity is the stock
    expect(result.lines[0]?.quantity).toBe(5)
    expect(result.warnings).toEqual([{ variantId: 12, type: 'quantity_reduced' }])
    expect(result.totalCents).toBe(19500)
  })

  it('accepts a quantity equal to the stock', () => {
    // Given exactly the units in stock
    // When the cart is reconciled
    const result = reconcileCart([{ ...requested, quantity: 5 }], [variant])

    // Then there is no warning
    expect(result.warnings).toEqual([])
  })

  it('uses the current price', () => {
    // Given a price that changed
    // When the cart is reconciled
    const result = reconcileCart([requested], [{ ...variant, priceCents: 4200 }])

    // Then the line and the total use the current price
    expect(result.lines[0]?.priceCents).toBe(4200)
    expect(result.warnings).toEqual([{ variantId: 12, type: 'price_changed' }])
    expect(result.totalCents).toBe(8400)
  })

  it('keeps the valid lines when another one is removed', () => {
    // Given a valid line and one that does not exist
    const missing = { variantId: 99, quantity: 1, priceCents: 1000 }

    // When the cart is reconciled
    const result = reconcileCart([requested, missing], [variant])

    // Then only the valid line is kept
    expect(result.lines).toEqual([validLine])
    expect(result.warnings).toEqual([{ variantId: 99, type: 'unavailable' }])
  })

  it('returns an empty cart when there are no lines', () => {
    // Given an empty cart
    // When the cart is reconciled
    // Then there are no lines, warnings or total
    expect(reconcileCart([], [])).toEqual({ lines: [], warnings: [], totalCents: 0 })
  })

  it('gives two warnings when the price and the stock changed', () => {
    // Given a line with too many units and an old price
    const changedVariant = { ...variant, priceCents: 4200, stock: 1 }

    // When the cart is reconciled
    const result = reconcileCart([{ ...requested, quantity: 2 }], [changedVariant])

    // Then both changes are applied and explained
    expect(result.lines[0]).toMatchObject({ quantity: 1, priceCents: 4200 })
    expect(result.warnings).toEqual([
      { variantId: 12, type: 'quantity_reduced' },
      { variantId: 12, type: 'price_changed' },
    ])
    expect(result.totalCents).toBe(4200)
  })
})

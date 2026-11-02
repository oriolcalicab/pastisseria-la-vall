import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CartLine } from '../types/cart'
import { loadCart, saveCart } from './cartStorage'

const CART_KEY = 'pastisseria-la-vall:cart'

const line: CartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

describe('cartStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads the cart that was saved', () => {
    // Given a saved cart
    saveCart([line])

    // When the cart is loaded
    // Then the same lines are returned
    expect(loadCart()).toEqual([line])
  })

  it('returns an empty cart when nothing was saved', () => {
    // Given nothing in the storage
    // When the cart is loaded
    // Then the cart is empty
    expect(loadCart()).toEqual([])
  })

  it.each([
    ['text that is not JSON', 'no és json'],
    ['JSON that is not a list', '{"variantId":12}'],
  ])('returns an empty cart with %s', (_case, stored) => {
    // Given something wrong in the storage
    localStorage.setItem(CART_KEY, stored)

    // When the cart is loaded
    // Then the cart is empty
    expect(loadCart()).toEqual([])
  })

  it('removes the lines that are not valid', () => {
    // Given a valid line and two wrong ones
    const stored = [line, { ...line, variantId: 13, quantity: -3 }, { variantId: 14 }]
    localStorage.setItem(CART_KEY, JSON.stringify(stored))

    // When the cart is loaded
    // Then only the valid line is left
    expect(loadCart()).toEqual([line])
  })

  it('does not fail when the storage can not be used', () => {
    // Given a browser that blocks the storage
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })

    // When the cart is saved
    // Then nothing fails
    expect(() => saveCart([line])).not.toThrow()
  })
})
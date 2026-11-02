import { describe, expect, it } from 'vitest'
import type { CartLine, NewCartLine } from '../types/cart'
import {
  addLine,
  getCartItemCount,
  getCartTotalCents,
  removeLine,
  setLineQuantity,
} from './cartLines'

const cake: NewCartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
}

const cupcakes: NewCartLine = {
  variantId: 20,
  productId: 8,
  productName: 'Cupcakes de vainilla',
  variantName: 'Caixa de 4',
  priceCents: 1400,
  imageUrl: null,
}

const lines: CartLine[] = [
  { ...cake, quantity: 2 },
  { ...cupcakes, quantity: 1 },
]

describe('addLine', () => {
  it('adds a variant that is not in the cart', () => {
    // Given an empty cart
    // When a variant is added
    // Then there is a line with quantity 1
    expect(addLine([], cake)).toEqual([{ ...cake, quantity: 1 }])
  })

  it('adds the quantity to a variant that is already in the cart', () => {
    // Given a cart with two units of a variant
    // When three more are added
    const result = addLine(lines, cake, 3)

    // Then there is still one line with five units
    expect(result).toHaveLength(2)
    expect(result[0]?.quantity).toBe(5)
  })

  it('does not change the original list', () => {
    // Given a cart
    // When a variant is added
    addLine(lines, cake)

    // Then the original list is the same
    expect(lines[0]?.quantity).toBe(2)
  })
})

describe('setLineQuantity', () => {
  it('changes the quantity of the variant', () => {
    // Given a cart
    // When the quantity of a variant is changed
    const result = setLineQuantity(lines, 20, 4)

    // Then only that line changes
    expect(result[0]?.quantity).toBe(2)
    expect(result[1]?.quantity).toBe(4)
  })

  it.each([0, -1])('does not accept the quantity %i', (quantity) => {
    // Given a cart
    // When the quantity is lower than 1
    // Then the cart does not change
    expect(setLineQuantity(lines, 12, quantity)).toEqual(lines)
  })
})

describe('removeLine', () => {
  it('removes the variant', () => {
    // Given a cart with two lines
    // When a variant is removed
    // Then only the other one is left
    expect(removeLine(lines, 12)).toEqual([{ ...cupcakes, quantity: 1 }])
  })
})

describe('cart totals', () => {
  it('counts all the units', () => {
    // Given two units and one unit
    // When the items are counted
    // Then there are three
    expect(getCartItemCount(lines)).toBe(3)
  })

  it('adds the price of all the units', () => {
    // Given 2 x 3900 and 1 x 1400
    // When the total is calculated
    // Then it is 9200 cents
    expect(getCartTotalCents(lines)).toBe(9200)
  })

  it('returns 0 for an empty cart', () => {
    // Given an empty cart
    // When the totals are calculated
    // Then both are 0
    expect(getCartItemCount([])).toBe(0)
    expect(getCartTotalCents([])).toBe(0)
  })
})
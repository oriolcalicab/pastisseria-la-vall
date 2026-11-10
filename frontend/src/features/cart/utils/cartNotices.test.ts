import { describe, expect, it } from 'vitest'
import type { CartLine, CartWarningType } from '../types/cart'
import { getCartNotices } from './cartNotices'

const line: CartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

const name = 'Pastís de xocolata (6 racions)'

describe('getCartNotices', () => {
  it.each<[CartWarningType, string]>([
    ['unavailable', `${name} ja no està disponible i s'ha tret del carretó.`],
    ['out_of_stock', `${name} s'ha esgotat i s'ha tret del carretó.`],
    ['quantity_reduced', `No queden prou unitats de ${name} i s'ha ajustat la quantitat.`],
    ['price_changed', `El preu de ${name} ha canviat.`],
  ])('explains the warning %s', (type, message) => {
    // Given a warning about a line of the cart
    // When the notices are built
    // Then the message names the product
    expect(getCartNotices([{ variantId: 12, type }], [line])).toEqual([message])
  })
})

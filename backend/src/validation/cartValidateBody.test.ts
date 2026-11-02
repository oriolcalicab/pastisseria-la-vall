import { describe, expect, it } from 'vitest'
import { parseCartValidateBody } from './cartValidateBody'

const validLine = { variantId: 12, quantity: 2, priceCents: 3900 }

describe('parseCartValidateBody', () => {
  it('returns the lines', () => {
    // Given a valid body with an extra field
    const body = { lines: [{ ...validLine, productName: 'Inventat' }] }

    // When the body is parsed
    // Then only the known fields are returned
    expect(parseCartValidateBody(body)).toEqual([validLine])
  })

  it('accepts an empty cart', () => {
    // Given an empty cart
    // When the body is parsed
    // Then the list is empty
    expect(parseCartValidateBody({ lines: [] })).toEqual([])
  })

  it.each([
    ['not an object', null],
    ['without lines', {}],
    ['lines that are not a list', { lines: 'x' }],
    ['a line that is not an object', { lines: [1] }],
    ['a quantity of 0', { lines: [{ ...validLine, quantity: 0 }] }],
    ['a negative quantity', { lines: [{ ...validLine, quantity: -1 }] }],
    ['a quantity with decimals', { lines: [{ ...validLine, quantity: 1.5 }] }],
    ['a price as text', { lines: [{ ...validLine, priceCents: '3900' }] }],
    ['an id that is too big', { lines: [{ ...validLine, variantId: 2147483648 }] }],
    ['the same variant twice', { lines: [validLine, validLine] }],
  ])('returns null with %s', (_case, body) => {
    // Given an invalid body
    // When the body is parsed
    // Then null is returned
    expect(parseCartValidateBody(body)).toBeNull()
  })

  it('returns null with too many lines', () => {
    // Given 51 lines
    const lines = Array.from({ length: 51 }, (_, index) => ({ ...validLine, variantId: index + 1 }))

    // When the body is parsed
    // Then null is returned
    expect(parseCartValidateBody({ lines })).toBeNull()
  })
})
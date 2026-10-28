import { describe, expect, it } from 'vitest'
import { parseCreateProductBody } from './createProductBody.js'

const validVariant = { name: '6 racions', priceCents: 3900, stock: 5 }

const validBody = (overrides: object = {}) => ({
  categoryId: 1,
  name: 'Pastís de maduixa',
  description: 'Bescuit amb nata i maduixes',
  variants: [validVariant],
  ...overrides,
})

describe('parseCreateProductBody', () => {
  it('returns the clean product with its variants in order', () => {
    // Given a valid body with two variants and extra spaces
    const body = validBody({
      name: '  Pastís de maduixa  ',
      allergens: ' gluten, ou ',
      isVegan: false,
      variants: [validVariant, { name: '10 racions', priceCents: 4900, stock: 0 }],
    })

    // When the body is parsed
    const result = parseCreateProductBody(body)

    // Then the texts are trimmed and the variants keep their order
    expect(result).toEqual({
      ok: true,
      data: {
        categoryId: 1,
        name: 'Pastís de maduixa',
        description: 'Bescuit amb nata i maduixes',
        allergens: 'gluten, ou',
        isGlutenFree: false,
        isPlantMilk: false,
        isVegan: false,
        isActive: true,
        variants: [
          { name: '6 racions', priceCents: 3900, stock: 5, sortOrder: 0 },
          { name: '10 racions', priceCents: 4900, stock: 0, sortOrder: 1 },
        ],
      },
    })
  })

  it('uses the default values for the optional fields', () => {
    // Given a body without the optional fields
    // When the body is parsed
    // Then the product is active, without allergens and without special options
    expect(parseCreateProductBody(validBody())).toMatchObject({
      ok: true,
      data: { allergens: null, isGlutenFree: false, isPlantMilk: false, isVegan: false, isActive: true },
    })
  })

  it('ignores fields that can not be set', () => {
    // Given a body that tries to set the id
    // When the body is parsed
    const result = parseCreateProductBody(validBody({ id: 999 }))

    // Then the id is not in the data
    expect(result.ok && 'id' in result.data).toBe(false)
  })

  it.each([
    ['without variants', { variants: undefined }],
    ['with an empty list of variants', { variants: [] }],
  ])('rejects a product %s', (_case, overrides) => {
    // Given a product without any variant
    // When the body is parsed
    // Then it is rejected with a clear message
    expect(parseCreateProductBody(validBody(overrides))).toEqual({
      ok: false,
      error: 'El producte ha de tenir com a mínim una variant',
    })
  })

  it.each([
    ['price 0', { priceCents: 0 }],
    ['a negative price', { priceCents: -100 }],
    ['a price with decimals', { priceCents: 39.5 }],
    ['a price as text', { priceCents: '3900' }],
    ['a negative stock', { stock: -1 }],
    ['a stock with decimals', { stock: 2.5 }],
    ['an empty name', { name: '  ' }],
  ])('rejects a variant with %s', (_case, overrides) => {
    // Given a variant with an invalid value
    const body = validBody({ variants: [{ ...validVariant, ...overrides }] })

    // When the body is parsed
    // Then it is rejected
    expect(parseCreateProductBody(body)).toMatchObject({ ok: false })
  })

  it('tells which variant is wrong', () => {
    // Given a second variant with price 0
    const body = validBody({ variants: [validVariant, { ...validVariant, priceCents: 0 }] })

    // When the body is parsed
    // Then the message points to the second variant
    expect(parseCreateProductBody(body)).toMatchObject({
      ok: false,
      error: expect.stringContaining('variant 2'),
    })
  })

  it.each([
    ['an invalid category', { categoryId: '1' }],
    ['a name that is too short', { name: 'A' }],
    ['no description', { description: undefined }],
    ['allergens that are not text', { allergens: 123 }],
    ['an option that is not true or false', { isVegan: 'yes' }],
  ])('rejects a product with %s', (_case, overrides) => {
    // Given a product with an invalid field
    // When the body is parsed
    // Then it is rejected
    expect(parseCreateProductBody(validBody(overrides))).toMatchObject({ ok: false })
  })
})
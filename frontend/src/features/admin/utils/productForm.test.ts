import { describe, expect, it } from 'vitest'
import type { ProductFormValues } from '../types/productForm'
import { parseEurosToCents, validateProductForm } from './productForm'

const validVariant = { key: 1, name: '6 racions', price: '39,50', stock: '5' }

const validValues = (overrides: Partial<ProductFormValues> = {}): ProductFormValues => ({
  categoryId: '1',
  name: 'Pastís de maduixa',
  description: 'Bescuit amb nata i maduixes',
  allergens: '',
  isGlutenFree: false,
  isPlantMilk: false,
  isVegan: true,
  isActive: true,
  variants: [validVariant],
  ...overrides,
})

describe('parseEurosToCents', () => {
  it.each([
    ['39', 3900],
    ['39,5', 3950],
    ['39,50', 3950],
    ['39.50', 3950],
    ['0,29', 29],
    [' 12,00 ', 1200],
  ])('converts "%s" to %i cents', (value, cents) => {
    // Given a price written in euros
    // When it is converted
    // Then the cents are returned
    expect(parseEurosToCents(value)).toBe(cents)
  })

  it.each(['', 'abc', '-5', '39,555', '1.234,50', '39,'])('rejects "%s"', (value) => {
    // Given a price that is not valid
    // When it is converted
    // Then null is returned
    expect(parseEurosToCents(value)).toBeNull()
  })
})

describe('validateProductForm', () => {
  it('returns the product ready to send', () => {
    // Given a valid form with spaces and a second variant with stock 0
    const values = validValues({
      name: '  Pastís de maduixa  ',
      variants: [validVariant, { key: 2, name: '10 racions', price: '49', stock: '0' }],
    })

    // When the form is validated
    const result = validateProductForm(values)

    // Then the texts are trimmed and the prices are in cents
    expect(result).toEqual({
      ok: true,
      product: {
        categoryId: 1,
        name: 'Pastís de maduixa',
        description: 'Bescuit amb nata i maduixes',
        allergens: '',
        isGlutenFree: false,
        isPlantMilk: false,
        isVegan: true,
        isActive: true,
        variants: [
          { name: '6 racions', priceCents: 3950, stock: 5 },
          { name: '10 racions', priceCents: 4900, stock: 0 },
        ],
      },
    })
  })

  it('returns all the errors of an empty form at once', () => {
    // Given an empty form
    const values = validValues({ categoryId: '', name: '', description: '', variants: [] })

    // When the form is validated
    const result = validateProductForm(values)

    // Then every required field has its error
    expect(result).toEqual({
      ok: false,
      errors: {
        categoryId: 'Tria una categoria',
        name: 'El nom ha de tenir entre 2 i 100 caràcters',
        description: 'Escriu una descripció de fins a 2000 caràcters',
        variants: 'Afegeix com a mínim una variant',
      },
    })
  })

  it('points to the field of the variant that is wrong', () => {
    // Given a second variant with price 0 and a negative stock
    const values = validValues({
      variants: [validVariant, { key: 2, name: '10 racions', price: '0', stock: '-1' }],
    })

    // When the form is validated
    const result = validateProductForm(values)

    // Then only the second variant has errors, in the price and the stock
    expect(result).toMatchObject({
      ok: false,
      errors: {
        variantErrors: [
          {},
          {
            price: 'Escriu un preu més gran que 0, amb 2 decimals com a màxim',
            stock: 'Escriu un stock enter, 0 o més',
          },
        ],
      },
    })
  })

  it('rejects a variant without name', () => {
    // Given a variant with only spaces in the name
    const values = validValues({ variants: [{ ...validVariant, name: '   ' }] })

    // When the form is validated
    // Then the name of the variant has an error
    expect(validateProductForm(values)).toMatchObject({
      ok: false,
      errors: { variantErrors: [{ name: 'Escriu un nom de fins a 50 caràcters' }] },
    })
  })

  it('rejects allergens that are too long', () => {
    // Given allergens with more than 300 characters
    const values = validValues({ allergens: 'a'.repeat(301) })

    // When the form is validated
    // Then the allergens have an error
    expect(validateProductForm(values)).toMatchObject({
      ok: false,
      errors: { allergens: 'Els al·lèrgens poden tenir fins a 300 caràcters' },
    })
  })
})
import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { getDietLabels } from './dietLabels'

const product = (diets: Partial<Product>): Product => ({
  id: 1,
  name: 'Pastís de xocolata',
  description: 'Pastís de la casa',
  imageUrl: null,
  allergens: null,
  isGlutenFree: false,
  isPlantMilk: false,
  isVegan: false,
  category: { id: 1, name: 'Pastissos', slug: 'pastissos' },
  variants: [],
  ...diets,
})

describe('getDietLabels', () => {
  it('lists the diets of the product in order', () => {
    // Given a product for every diet
    const all = product({ isGlutenFree: true, isPlantMilk: true, isVegan: true })

    // When its labels are asked for
    const labels = getDietLabels(all)

    // Then all three are listed
    expect(labels).toEqual(['Sense gluten', 'Llet vegetal', 'Vegà'])
  })

  it('lists nothing for a product without diets', () => {
    // Given a product without diets
    // When its labels are asked for
    const labels = getDietLabels(product({}))

    // Then the list is empty
    expect(labels).toEqual([])
  })
})

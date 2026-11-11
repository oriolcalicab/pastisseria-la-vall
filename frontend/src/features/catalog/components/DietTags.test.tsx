import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import DietTags from './DietTags'

const product: Product = {
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
}

describe('DietTags', () => {
  it('shows nothing for a product without diets', () => {
    // Given a product without diets
    // When its tags are shown
    const { container } = render(<DietTags product={product} />)

    // Then nothing is rendered
    expect(container).toBeEmptyDOMElement()
  })
})

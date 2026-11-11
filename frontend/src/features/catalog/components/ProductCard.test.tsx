import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import ProductCard from './ProductCard'

const product: Product = {
  id: 7,
  name: 'Cupcakes de vainilla',
  description: 'Caixa de cupcakes',
  imageUrl: null,
  allergens: null,
  isGlutenFree: false,
  isPlantMilk: true,
  isVegan: true,
  category: { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
  variants: [{ id: 3, name: 'Caixa de 6', priceCents: 1400, inStock: true }],
}

describe('ProductCard', () => {
  it('links to the product and shows its diets', () => {
    // Given a vegan product with plant milk
    // When its card is shown
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    )

    // Then it links to the product and shows only its diets
    expect(screen.getByRole('link')).toHaveAttribute('href', '/productes/7')
    expect(screen.getByText('Llet vegetal')).toBeInTheDocument()
    expect(screen.getByText('Vegà')).toBeInTheDocument()
    expect(screen.queryByText('Sense gluten')).not.toBeInTheDocument()
  })
})

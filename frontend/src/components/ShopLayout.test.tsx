import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '../features/cart/CartProvider'
import { saveCart } from '../features/cart/services/cartStorage'
import ShopLayout from './ShopLayout'

const renderLayout = () =>
  render(
    <CartProvider>
      <MemoryRouter>
        <Routes>
          <Route element={<ShopLayout />}>
            <Route path="/" element={<p>Contingut de la pàgina</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </CartProvider>,
  )

describe('ShopLayout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the header and the page', () => {
    // Given an empty cart
    // When a shop page is shown
    renderLayout()

    // Then the header and the page are shown
    expect(screen.getByRole('link', { name: 'Productes' })).toHaveAttribute('href', '/productes')
    expect(screen.getByRole('link', { name: 'Carretó, 0 unitats' })).toHaveAttribute(
      'href',
      '/carreto',
    )
    expect(screen.getByText('Contingut de la pàgina')).toBeInTheDocument()
  })

  it('shows how many units are in the cart', () => {
    // Given a cart with three units
    saveCart([
      {
        variantId: 12,
        productId: 7,
        productName: 'Pastís de xocolata',
        variantName: '6 racions',
        priceCents: 3900,
        imageUrl: null,
        quantity: 3,
      },
    ])

    // When a shop page is shown
    renderLayout()

    // Then the header shows the units
    expect(screen.getByRole('link', { name: 'Carretó, 3 unitats' })).toHaveTextContent(
      'Carretó (3)',
    )
  })
})

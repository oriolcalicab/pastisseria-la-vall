import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CartProvider } from '../../features/cart/CartProvider'
import { loadCart, saveCart } from '../../features/cart/services/cartStorage'
import type { CartLine } from '../../features/cart/types/cart'
import CartPage from './CartPage'

const cake: CartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

const cupcakes: CartLine = {
  variantId: 20,
  productId: 8,
  productName: 'Cupcakes de vainilla',
  variantName: 'Caixa de 4',
  priceCents: 1400,
  imageUrl: null,
  quantity: 1,
}

const renderPage = () =>
  render(
    <CartProvider>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </CartProvider>,
  )

const cakeLabel = 'Pastís de xocolata, 6 racions'

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows a message when the cart is empty', () => {
    // Given an empty cart
    // When the page is shown
    renderPage()

    // Then the visitor is invited to see the products
    expect(screen.getByText('El teu carretó està buit.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Veure els productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
  })

  it('shows the lines with their subtotal and the total', () => {
    // Given a cart with two lines
    saveCart([cake, cupcakes])

    // When the page is shown
    renderPage()

    // Then the subtotals and the total are shown
    expect(screen.getByText(/^78,00\s€$/)).toBeInTheDocument()
    expect(screen.getAllByText(/^14,00\s€/)).not.toHaveLength(0)
    expect(screen.getByText(/Total: 92,00\s€/)).toBeInTheDocument()
  })

  it('adds a unit and updates the totals', async () => {
    // Given a cart with two units
    saveCart([cake])
    renderPage()

    // When the visitor adds a unit
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: `Afegeix una unitat de ${cakeLabel}` }))

    // Then the total changes and it is saved
    expect(screen.getByText(/Total: 117,00\s€/)).toBeInTheDocument()
    expect(loadCart()[0]?.quantity).toBe(3)
  })

  it('removes a unit', async () => {
    // Given a cart with two units
    saveCart([cake])
    renderPage()

    // When the visitor removes a unit
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: `Treu una unitat de ${cakeLabel}` }))

    // Then there is one unit left
    expect(loadCart()[0]?.quantity).toBe(1)
  })

  it('does not let the quantity go below 1', () => {
    // Given a line with one unit
    saveCart([{ ...cake, quantity: 1 }])

    // When the page is shown
    renderPage()

    // Then the button to remove a unit can not be used
    expect(screen.getByRole('button', { name: `Treu una unitat de ${cakeLabel}` })).toBeDisabled()
  })

  it('removes a line and shows the empty cart', async () => {
    // Given a cart with one line
    saveCart([cake])
    renderPage()

    // When the visitor removes it
    await userEvent.setup().click(screen.getByRole('button', { name: `Elimina ${cakeLabel}` }))

    // Then the cart is empty
    expect(screen.getByText('El teu carretó està buit.')).toBeInTheDocument()
    expect(loadCart()).toEqual([])
  })
})
import { act, render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from '../../features/cart/CartProvider'
import { validateCart } from '../../features/cart/services/cartApi'
import { loadCart, saveCart } from '../../features/cart/services/cartStorage'
import type { CartLine } from '../../features/cart/types/cart'
import CartPage from './CartPage'

vi.mock('../../features/cart/services/cartApi', () => ({ validateCart: vi.fn() }))

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

const renderPage = async () => {
  render(
    <CartProvider>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </CartProvider>,
  )
  await act(async () => {})
}

const cakeLabel = 'Pastís de xocolata, 6 racions'

describe('CartPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    vi.mocked(validateCart).mockImplementation(async (lines) => ({
      lines,
      warnings: [],
      totalCents: 0,
    }))
  })

  it('shows a message when the cart is empty and does not validate it', async () => {
    // Given an empty cart
    // When the page is shown
    await renderPage()

    // Then the visitor is invited to see the products
    expect(screen.getByText('El teu carretó està buit.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Veure els productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
    expect(validateCart).not.toHaveBeenCalled()
    expect(screen.queryByRole('link', { name: 'Tramita la comanda' })).not.toBeInTheDocument()
  })

  it('shows the lines with their subtotal and the total', async () => {
    // Given a cart with two lines
    saveCart([cake, cupcakes])

    // When the page is shown
    await renderPage()

    // Then the subtotals and the total are shown
    expect(screen.getByText(/^78,00\s€$/)).toBeInTheDocument()
    expect(screen.getByText(/Total: 92,00\s€/)).toBeInTheDocument()
  })

  it('adds a unit and updates the totals', async () => {
    // Given a cart with two units
    saveCart([cake])
    await renderPage()

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
    await renderPage()

    // When the visitor removes a unit
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: `Treu una unitat de ${cakeLabel}` }))

    // Then there is one unit left
    expect(loadCart()[0]?.quantity).toBe(1)
  })

  it('does not let the quantity go below 1', async () => {
    // Given a line with one unit
    saveCart([{ ...cake, quantity: 1 }])

    // When the page is shown
    await renderPage()

    // Then the button to remove a unit can not be used
    expect(screen.getByRole('button', { name: `Treu una unitat de ${cakeLabel}` })).toBeDisabled()
  })

  it('removes a line and shows the empty cart', async () => {
    // Given a cart with one line
    saveCart([cake])
    await renderPage()

    // When the visitor removes it
    await userEvent.setup().click(screen.getByRole('button', { name: `Elimina ${cakeLabel}` }))

    // Then the cart is empty
    expect(screen.getByText('El teu carretó està buit.')).toBeInTheDocument()
    expect(loadCart()).toEqual([])
  })

  it('updates the cart and warns when the price changed', async () => {
    // Given a backend with a new price
    saveCart([cake])
    vi.mocked(validateCart).mockResolvedValue({
      lines: [{ ...cake, priceCents: 4200 }],
      warnings: [{ variantId: 12, type: 'price_changed' }],
      totalCents: 8400,
    })

    // When the page is shown
    await renderPage()

    // Then the visitor is warned and the cart uses the new price
    expect(screen.getByRole('alert')).toHaveTextContent(
      'El preu de Pastís de xocolata (6 racions) ha canviat.',
    )
    expect(screen.getByText(/Total: 84,00\s€/)).toBeInTheDocument()
    expect(loadCart()[0]?.priceCents).toBe(4200)
  })

  it('explains why a line was removed', async () => {
    // Given a variant that is not available any more
    saveCart([cake])
    vi.mocked(validateCart).mockResolvedValue({
      lines: [],
      warnings: [{ variantId: 12, type: 'unavailable' }],
      totalCents: 0,
    })

    // When the page is shown
    await renderPage()

    // Then the cart is empty and the visitor knows why
    expect(screen.getByRole('alert')).toHaveTextContent('ja no està disponible')
    expect(screen.getByText('El teu carretó està buit.')).toBeInTheDocument()
  })

  it('keeps the cart when it can not be validated', async () => {
    // Given a backend that fails
    saveCart([cake])
    vi.mocked(validateCart).mockRejectedValue(new Error('Request failed'))

    // When the page is shown
    await renderPage()

    // Then the visitor is warned and the cart does not change
    expect(screen.getByRole('alert')).toHaveTextContent("No s'ha pogut comprovar el carretó.")
    expect(loadCart()).toEqual([cake])
  })

  it('adjusts the quantity when there is not enough stock', async () => {
    // Given more units than the stock
    saveCart([{ ...cake, quantity: 9 }])
    vi.mocked(validateCart).mockResolvedValue({
      lines: [{ ...cake, quantity: 3 }],
      warnings: [{ variantId: 12, type: 'quantity_reduced' }],
      totalCents: 11700,
    })

    // When the page is shown
    await renderPage()

    // Then the visitor is warned and the quantity is the stock
    expect(screen.getByRole('alert')).toHaveTextContent('No queden prou unitats')
    expect(screen.getByLabelText(`Quantitat de ${cakeLabel}`)).toHaveTextContent('3')
  })

  it('keeps the updated cart after reloading the page', async () => {
    // Given a cart that was adjusted by the backend
    saveCart([{ ...cake, quantity: 9 }])
    vi.mocked(validateCart).mockResolvedValueOnce({
      lines: [{ ...cake, quantity: 3 }],
      warnings: [{ variantId: 12, type: 'quantity_reduced' }],
      totalCents: 11700,
    })
    await renderPage()

    // When the page is loaded again
    cleanup()
    await renderPage()

    // Then the adjusted quantity is kept and there is nothing to warn about
    expect(screen.getByLabelText(`Quantitat de ${cakeLabel}`)).toHaveTextContent('3')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not validate again when the quantity changes', async () => {
    // Given a validated cart
    saveCart([cake])
    await renderPage()

    // When the visitor adds a unit
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: `Afegeix una unitat de ${cakeLabel}` }))

    // Then the backend was only called when the page was opened
    expect(validateCart).toHaveBeenCalledOnce()
  })

  it('offers to go to the checkout', async () => {
    // Given a cart with products
    saveCart([cake])

    // When the page is shown
    await renderPage()

    // Then there is a link to the checkout
    expect(screen.getByRole('link', { name: 'Tramita la comanda' })).toHaveAttribute(
      'href',
      '/checkout',
    )
  })
})

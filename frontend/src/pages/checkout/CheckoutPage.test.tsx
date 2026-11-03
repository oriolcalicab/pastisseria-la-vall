import { render, screen } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { CartProvider } from '../../features/cart/CartProvider'
import { saveCart } from '../../features/cart/services/cartStorage'
import CheckoutPage from './CheckoutPage'

vi.mock('../../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))

const renderCheckout = () =>
  render(
    <CartProvider>
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/login" element={<p>Pàgina de login</p>} />
          <Route path="/carreto" element={<p>Pàgina del carretó</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </CartProvider>,
  )

const login = () =>
  vi.mocked(useAuth).mockReturnValue({ user: { uid: 'u1' } as User, isLoading: false })

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('sends a visitor without session to the login page', () => {
    // Given a visitor without session and a cart with products
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false })
    saveCart([
      {
        variantId: 12,
        productId: 7,
        productName: 'Pastís de xocolata',
        variantName: '6 racions',
        priceCents: 3900,
        imageUrl: null,
        quantity: 2,
      },
    ])

    // When the visitor opens the checkout
    renderCheckout()

    // Then the visitor is sent to the login page
    expect(screen.getByText('Pàgina de login')).toBeInTheDocument()
  })

  it('sends a customer with an empty cart to the cart page', () => {
    // Given a logged customer with an empty cart
    login()

    // When the customer opens the checkout
    renderCheckout()

    // Then the customer is sent to the cart
    expect(screen.getByText('Pàgina del carretó')).toBeInTheDocument()
  })

  it('shows the summary of the cart', () => {
    // Given a logged customer with a cart
    login()
    saveCart([
      {
        variantId: 12,
        productId: 7,
        productName: 'Pastís de xocolata',
        variantName: '6 racions',
        priceCents: 3900,
        imageUrl: null,
        quantity: 2,
      },
    ])

    // When the customer opens the checkout
    renderCheckout()

    // Then the summary is shown
    expect(screen.getByRole('heading', { name: 'Finalitza la comanda' })).toBeInTheDocument()
    expect(screen.getByText('2 × Pastís de xocolata (6 racions)')).toBeInTheDocument()
    expect(screen.getByText(/Total: 78,00\s€/)).toBeInTheDocument()
  })
})
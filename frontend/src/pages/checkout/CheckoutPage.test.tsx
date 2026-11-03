import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { CartProvider } from '../../features/cart/CartProvider'
import { saveCart } from '../../features/cart/services/cartStorage'
import { useDeliveryDates } from '../../features/delivery/hooks/useDeliveryDates'
import { getCalendarWeeks, getCurrentMonth } from '../../features/delivery/utils/calendar'
import CheckoutPage from './CheckoutPage'

vi.mock('../../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../../features/delivery/hooks/useDeliveryDates', () => ({ useDeliveryDates: vi.fn() }))

const cartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
  quantity: 2,
}

const availableDate = `${getCurrentMonth(new Date())}-15`

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

const chooseDate = (user: ReturnType<typeof userEvent.setup>) => {
  const day = screen
    .getAllByRole('button')
    .find((button) => button.dataset.date === availableDate)

  return user.click(day!)
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    vi.mocked(useDeliveryDates).mockImplementation((month) => ({
      status: 'success',
      days: getCalendarWeeks(month)
        .flat()
        .filter((date) => date !== null)
        .map((date) => ({ date, available: true, reason: null })),
      retry: vi.fn(),
    }))
  })

  it('sends a visitor without session to the login page', () => {
    // Given a visitor without session and a cart with products
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false })
    saveCart([cartLine])

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
    saveCart([cartLine])

    // When the customer opens the checkout
    renderCheckout()

    // Then the summary is shown
    expect(screen.getByRole('heading', { name: 'Finalitza la comanda' })).toBeInTheDocument()
    expect(screen.getByText('2 × Pastís de xocolata (6 racions)')).toBeInTheDocument()
    expect(screen.getByText(/Total: 78,00\s€/)).toBeInTheDocument()
  })

  it('does not continue without a delivery date', () => {
    // Given a logged customer with a cart
    login()
    saveCart([cartLine])

    // When the checkout is opened
    renderCheckout()

    // Then the calendar is shown and the customer can not continue
    expect(screen.getByRole('heading', { name: 'Pas 1 · Data de lliurament' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continua' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continua' })).toHaveAccessibleDescription(
      'Tria una data per continuar.',
    )
  })

  it('continues after choosing a delivery date', async () => {
    // Given a logged customer with a cart
    login()
    saveCart([cartLine])
    renderCheckout()
    const user = userEvent.setup()

    // When the customer chooses a date and continues
    await chooseDate(user)
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // Then the next step shows the chosen date
    expect(screen.getByRole('heading', { name: 'Pas 2 · Mètode de lliurament' })).toBeInTheDocument()
    expect(screen.getByText(/Data de lliurament: .*15/)).toBeInTheDocument()
  })

  it('keeps the date when going back', async () => {
    // Given a customer on the second step
    login()
    saveCart([cartLine])
    renderCheckout()
    const user = userEvent.setup()
    await chooseDate(user)
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // When the customer goes back to change the date
    await user.click(screen.getByRole('button', { name: 'Canvia la data' }))

    // Then the chosen date is still selected
    expect(screen.getByRole('button', { name: 'Continua' })).toBeEnabled()
  })
})
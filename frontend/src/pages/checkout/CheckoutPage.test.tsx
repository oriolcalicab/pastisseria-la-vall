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
import type { PickupPoint } from '../../features/pickup/types/pickupPoint'
import { useShippingFee } from '../../features/checkout/hooks/useShippingFee'

vi.mock('../../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../../features/delivery/hooks/useDeliveryDates', () => ({ useDeliveryDates: vi.fn() }))
vi.mock('../../features/checkout/hooks/useShippingFee', () => ({ useShippingFee: vi.fn() }))
vi.mock('../../features/pickup/components/PickupPoints', () => ({
  default: ({ onSelect }: { onSelect: (point: PickupPoint) => void }) => (
    <button type="button" onClick={() => onSelect(eixample)}>
      Tria Eixample
    </button>
  ),
}))

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

const eixample: PickupPoint = {
  id: 2,
  name: 'La Vall · Eixample',
  address: 'Carrer de Girona, 84',
  city: 'Barcelona',
  latitude: 41.3965,
  longitude: 2.1675,
  openingHours: 'De dt. a ds., de 9 a 19 h',
}

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
  const day = screen.getAllByRole('button').find((button) => button.dataset.date === availableDate)

  return user.click(day!)
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    vi.mocked(useShippingFee).mockReturnValue({ status: 'success', feeCents: 500, retry: vi.fn() })
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
    expect(screen.getByText(/Subtotal: 78,00\s€/)).toBeInTheDocument()
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
    expect(
      screen.getByRole('heading', { name: 'Pas 2 · Mètode de lliurament' }),
    ).toBeInTheDocument()
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

  const goToPickupStep = async (user: ReturnType<typeof userEvent.setup>) => {
    login()
    saveCart([cartLine])
    renderCheckout()
    await chooseDate(user)
    await user.click(screen.getByRole('button', { name: 'Continua' }))
    await user.click(screen.getByRole('radio', { name: /Recollida en un punt/ }))
  }

  it('does not confirm a pickup without a pickup point', async () => {
    // Given a customer on the second step
    const user = userEvent.setup()
    await goToPickupStep(user)

    // When no pickup point is chosen
    // Then the customer can not continue
    expect(screen.getByRole('button', { name: 'Continua' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continua' })).toHaveAccessibleDescription(
      'Tria un punt de recollida per continuar.',
    )
  })

  it('continues to the review with the chosen pickup point', async () => {
    // Given a customer on the second step
    const user = userEvent.setup()
    await goToPickupStep(user)

    // When the customer chooses a pickup point and continues
    await user.click(screen.getByRole('button', { name: 'Tria Eixample' }))
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // Then the review shows the date and the pickup point
    expect(screen.getByRole('heading', { name: 'Pas 3 · Revisió' })).toBeInTheDocument()
    expect(
      screen.getByText('La Vall · Eixample, Carrer de Girona, 84, Barcelona'),
    ).toBeInTheDocument()
    expect(screen.getByText(/15/)).toBeInTheDocument()
  })

  it('keeps the pickup point when going back', async () => {
    // Given a customer on the review step
    const user = userEvent.setup()
    await goToPickupStep(user)
    await user.click(screen.getByRole('button', { name: 'Tria Eixample' }))
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // When the customer goes back to change the pickup point
    await user.click(screen.getByRole('button', { name: 'Canvia el punt de recollida' }))

    // Then the point is still chosen
    expect(screen.getByRole('button', { name: 'Continua' })).toBeEnabled()
  })

  const goToMethodStep = async (user: ReturnType<typeof userEvent.setup>) => {
    login()
    saveCart([cartLine])
    renderCheckout()
    await chooseDate(user)
    await user.click(screen.getByRole('button', { name: 'Continua' }))
  }

  it('asks for a delivery method first', async () => {
    // Given a customer on the second step
    const user = userEvent.setup()
    await goToMethodStep(user)

    // When no method is chosen
    // Then the customer can not continue
    expect(screen.getByRole('button', { name: 'Continua' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continua' })).toHaveAccessibleDescription(
      'Tria com vols rebre la comanda per continuar.',
    )
  })

  it('only shows the pickup points for a pickup', async () => {
    // Given a customer on the second step
    const user = userEvent.setup()
    await goToMethodStep(user)

    // When the customer chooses home delivery
    await user.click(screen.getByRole('radio', { name: /Lliurament a domicili/ }))

    // Then the address form is shown instead of the pickup points
    expect(screen.getByLabelText('Codi postal')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tria Eixample' })).not.toBeInTheDocument()
  })

  it('does not continue with an address outside Barcelona', async () => {
    // Given a customer who chose home delivery
    const user = userEvent.setup()
    await goToMethodStep(user)
    await user.click(screen.getByRole('radio', { name: /Lliurament a domicili/ }))
    await user.type(screen.getByLabelText('Adreça'), 'Carrer Major, 1')
    await user.type(screen.getByLabelText('Codi postal'), '28001')

    // When the customer continues
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // Then the postal code is marked and the step does not change
    expect(screen.getByLabelText('Codi postal')).toHaveAttribute('aria-invalid', 'true')
    expect(
      screen.getByRole('heading', { name: 'Pas 2 · Mètode de lliurament' }),
    ).toBeInTheDocument()
  })

  it('continues to the review with a valid address', async () => {
    // Given a customer who chose home delivery
    const user = userEvent.setup()
    await goToMethodStep(user)
    await user.click(screen.getByRole('radio', { name: /Lliurament a domicili/ }))
    await user.type(screen.getByLabelText('Adreça'), 'Carrer de Mallorca, 120')
    await user.type(screen.getByLabelText('Codi postal'), '08036')

    // When the customer continues
    await user.click(screen.getByRole('button', { name: 'Continua' }))

    // Then the review shows the address
    expect(screen.getByRole('heading', { name: 'Pas 3 · Revisió' })).toBeInTheDocument()
    expect(screen.getByText('Carrer de Mallorca, 120, 08036 Barcelona')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Canvia l'adreça" })).toBeInTheDocument()
    expect(screen.getByText(/^83,00\s€$/)).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../features/auth/hooks/useAuth'
import { CartProvider } from '../features/cart/CartProvider'
import Header from './Header'

vi.mock('../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))

const renderHeader = () =>
  render(
    <CartProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </CartProvider>,
  )

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false })
  })

  it('links the logo to the home page', () => {
    // Given the header
    // When it is shown
    renderHeader()

    // Then the logo takes to the home page
    expect(screen.getByRole('link', { name: 'Pastisseria La Vall' })).toHaveAttribute('href', '/')
  })

  it('invites a visitor to sign in', () => {
    // Given a visitor without session
    // When the header is shown
    renderHeader()

    // Then there is a link to sign in
    expect(screen.getByRole('link', { name: 'Inicia sessió' })).toHaveAttribute('href', '/login')
  })

  it('links a customer to the account', () => {
    // Given a logged customer
    vi.mocked(useAuth).mockReturnValue({ user: { uid: 'u1' } as User, isLoading: false })

    // When the header is shown
    renderHeader()

    // Then there is a link to the account
    expect(screen.getByRole('link', { name: 'El meu compte' })).toHaveAttribute('href', '/compte')
  })

  it('opens and closes the mobile menu', async () => {
    // Given the header with the mobile menu closed
    const user = userEvent.setup()
    renderHeader()
    const button = screen.getByRole('button', { name: 'Obre el menú' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Menú del mòbil' })).not.toBeInTheDocument()

    // When the customer opens it
    await user.click(button)

    // Then the menu is shown and the button says it is open
    expect(screen.getByRole('navigation', { name: 'Menú del mòbil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tanca el menú' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})

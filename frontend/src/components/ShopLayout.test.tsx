import { lazy } from 'react'
import type { ComponentType } from 'react'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import { CartProvider } from '../features/cart/CartProvider'
import { saveCart } from '../features/cart/services/cartStorage'
import ShopLayout from './ShopLayout'

vi.mock('../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../features/auth/hooks/useCurrentUser', () => ({ useCurrentUser: vi.fn() }))

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
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false })
    vi.mocked(useCurrentUser).mockReturnValue({ currentUser: null, isLoading: false })
  })

  it('shows the header, the page and the footer', () => {
    // Given an empty cart
    // When a shop page is shown
    renderLayout()

    // Then the menu, the page and the footer are shown
    const menu = screen.getByRole('navigation', { name: 'Menú principal' })
    expect(within(menu).getByRole('link', { name: 'Productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
    expect(screen.getByRole('link', { name: 'Carretó, 0 unitats' })).toHaveAttribute(
      'href',
      '/carreto',
    )
    expect(screen.getByText('Contingut de la pàgina')).toBeInTheDocument()
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('img', { name: 'Pastisseria La Vall' })).toBeInTheDocument()
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
    expect(screen.getByRole('link', { name: 'Carretó, 3 unitats' })).toHaveTextContent('3')
  })

  it('keeps the header and shows a message while a page is loading', () => {
    // Given a page that is still being downloaded
    const SlowPage = lazy(() => new Promise<{ default: ComponentType }>(() => {}))

    // When the customer opens it
    render(
      <CartProvider>
        <MemoryRouter>
          <Routes>
            <Route element={<ShopLayout />}>
              <Route path="/" element={<SlowPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>,
    )

    // Then the menu stays and the loading message is shown
    expect(screen.getByRole('navigation', { name: 'Menú principal' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Carregant la pàgina...')
  })
})

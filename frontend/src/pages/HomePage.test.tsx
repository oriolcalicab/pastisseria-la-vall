import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProducts } from '../features/catalog/hooks/useProducts'
import type { Product } from '../features/catalog/types/product'
import HomePage from './HomePage'

vi.mock('../features/catalog/hooks/useProducts', () => ({ useProducts: vi.fn() }))

const retry = vi.fn()

const product = (id: number): Product => ({
  id,
  name: `Pastís ${id}`,
  description: 'Pastís de la casa',
  imageUrl: null,
  allergens: null,
  isGlutenFree: false,
  isPlantMilk: false,
  isVegan: false,
  category: { id: 1, name: 'Pastissos', slug: 'pastissos' },
  variants: [{ id, name: '6 racions', priceCents: 3900, inStock: true }],
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )

describe('HomePage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('invites the customer to see the products', () => {
    // Given the products are loading
    vi.mocked(useProducts).mockReturnValue({ status: 'loading', retry })

    // When the home page is shown
    renderPage()

    // Then the title and the link to the products are shown
    expect(
      screen.getByRole('heading', { level: 1, name: 'Les coses bones volen el seu temps.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Veure productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
  })

  it('shows only the first four products', () => {
    // Given the shop has five products
    vi.mocked(useProducts).mockReturnValue({
      status: 'success',
      data: {
        items: [1, 2, 3, 4, 5].map(product),
        page: 1,
        pageSize: 12,
        total: 5,
        totalPages: 1,
      },
      retry,
    })

    // When the home page is shown
    renderPage()

    // Then only four products are shown
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.queryByText('Pastís 5')).not.toBeInTheDocument()
  })

  it('lets the customer try again when the products fail', async () => {
    // Given the products could not be loaded
    const user = userEvent.setup()
    vi.mocked(useProducts).mockReturnValue({ status: 'error', retry })
    renderPage()

    // When the customer tries again
    await user.click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the products are requested again
    expect(retry).toHaveBeenCalledOnce()
  })
})

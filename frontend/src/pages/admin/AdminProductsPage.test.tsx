import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminProducts } from '../../features/admin/hooks/useAdminProducts'
import type { AdminProductPage } from '../../features/admin/types/product'
import AdminProductsPage from './AdminProductsPage'

vi.mock('../../features/admin/hooks/useAdminProducts', () => ({ useAdminProducts: vi.fn() }))

const retry = vi.fn()

const productPage = (overrides: Partial<AdminProductPage> = {}): AdminProductPage => ({
  items: [
    {
      id: 1,
      name: 'Croissant',
      isActive: true,
      category: { id: 1, name: 'Brioixeria' },
      variants: [
        { id: 1, name: 'Petit', priceCents: 150, stock: 10, isActive: true },
        { id: 2, name: 'Gran', priceCents: 280, stock: 30, isActive: true },
      ],
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
  totalPages: 1,
  ...overrides,
})

describe('AdminProductsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a message while the products are loading', () => {
    // Given the products are loading
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'loading', retry })

    // When the page is shown
    render(<AdminProductsPage />)

    // Then the loading message is shown
    expect(screen.getByText('Carregant productes...')).toBeInTheDocument()
  })

  it('shows an error and lets the admin retry', async () => {
    // Given the products could not be loaded
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'error', retry })
    render(<AdminProductsPage />)

    // When the admin clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the error is shown and the products are requested again
    expect(screen.getByText("No s'han pogut carregar els productes.")).toBeInTheDocument()
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows a message when there are no products', () => {
    // Given there are no products
    const data = productPage({ items: [], total: 0, totalPages: 0 })
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'success', data, retry })

    // When the page is shown
    render(<AdminProductsPage />)

    // Then the empty message is shown
    expect(screen.getByText('Encara no hi ha cap producte.')).toBeInTheDocument()
  })

  it('shows a row with the product summary', () => {
    // Given a product with two active variants
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'success', data: productPage(), retry })

    // When the page is shown
    render(<AdminProductsPage />)

    // Then the row has the category, the from price, the variants, the stock and the status
    const row = screen.getByRole('row', { name: /Croissant/ })
    expect(row).toHaveTextContent('Brioixeria')
    expect(row).toHaveTextContent(/1,50\s€/)
    expect(row).toHaveTextContent('2')
    expect(row).toHaveTextContent('40')
    expect(row).toHaveTextContent('Actiu')
  })

  it('searches from the first page', async () => {
    // Given a page without results
    const data = productPage({ items: [], total: 0, totalPages: 0 })
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'success', data, retry })
    render(<AdminProductsPage />)

    // When the admin searches "croi"
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Cerca per nom'), 'croi')
    await user.click(screen.getByRole('button', { name: 'Cerca' }))

    // Then the first page is requested with the search and the empty message mentions it
    expect(useAdminProducts).toHaveBeenLastCalledWith({ page: 1, search: 'croi' })
    expect(
      screen.getByText('No hi ha cap producte que coincideixi amb "croi".'),
    ).toBeInTheDocument()
  })

  it('asks for the next page', async () => {
    // Given a first page of two
    const data = productPage({ total: 25, totalPages: 2 })
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'success', data, retry })
    render(<AdminProductsPage />)

    // When the admin clicks next
    await userEvent.setup().click(screen.getByRole('button', { name: 'Següent »' }))

    // Then the second page is requested
    expect(useAdminProducts).toHaveBeenLastCalledWith({ page: 2, search: '' })
  })
  
    it('keeps the search when going to the next page', async () => {
    // Given a search with two pages of results
    const data = productPage({ total: 25, totalPages: 2 })
    vi.mocked(useAdminProducts).mockReturnValue({ status: 'success', data, retry })
    render(<AdminProductsPage />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Cerca per nom'), 'pastis')
    await user.click(screen.getByRole('button', { name: 'Cerca' }))

    // When the admin clicks next
    await user.click(screen.getByRole('button', { name: 'Següent »' }))

    // Then the second page of the same search is requested
    expect(useAdminProducts).toHaveBeenLastCalledWith({ page: 2, search: 'pastis' })
  })
})
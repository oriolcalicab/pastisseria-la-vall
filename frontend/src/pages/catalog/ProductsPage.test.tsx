import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProducts } from '../../features/catalog/hooks/useProducts'
import type { ProductPage } from '../../features/catalog/types/product'
import ProductsPage from './ProductsPage'
import noProductImage from '../../assets/no-product.svg'

vi.mock('../../features/catalog/hooks/useProducts', () => ({ useProducts: vi.fn() }))

const retry = vi.fn()

const productPage = (overrides: Partial<ProductPage> = {}): ProductPage => ({
  items: [
    {
      id: 1,
      name: 'Pastís de xocolata',
      description: 'Pastís amb cobertura de xocolata',
      imageUrl: 'https://example.com/pastis.jpg',
      allergens: null,
      isGlutenFree: false,
      isPlantMilk: false,
      isVegan: false,
      category: { id: 1, name: 'Pastissos', slug: 'pastissos' },
      variants: [
        { id: 1, name: '6 racions', priceCents: 3900, inStock: true },
        { id: 2, name: '10 racions', priceCents: 4900, inStock: true },
      ],
    },
  ],
  page: 1,
  pageSize: 12,
  total: 1,
  totalPages: 1,
  ...overrides,
})

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a message while the products are loading', () => {
    // Given the products are loading
    vi.mocked(useProducts).mockReturnValue({ status: 'loading', retry })

    // When the page is shown
    render(<ProductsPage />)

    // Then the loading message is shown
    expect(screen.getByText('Carregant productes...')).toBeInTheDocument()
  })

  it('shows an error and lets the user retry', async () => {
    // Given the products could not be loaded
    vi.mocked(useProducts).mockReturnValue({ status: 'error', retry })
    render(<ProductsPage />)

    // When the user clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the error is shown and the products are requested again
    expect(screen.getByText("No s'han pogut carregar els productes.")).toBeInTheDocument()
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows a message when there are no products', () => {
    // Given there are no products
    const data = productPage({ items: [], total: 0, totalPages: 0 })
    vi.mocked(useProducts).mockReturnValue({ status: 'success', data, retry })

    // When the page is shown
    render(<ProductsPage />)

    // Then the empty message is shown
    expect(screen.getByText('De moment no hi ha cap producte disponible.')).toBeInTheDocument()
  })

  it('shows a card with the image, the name and the from price', () => {
    // Given a product with two variants
    vi.mocked(useProducts).mockReturnValue({ status: 'success', data: productPage(), retry })

    // When the page is shown
    render(<ProductsPage />)

    // Then the card shows the image, the name and the lowest price
    expect(screen.getByRole('img', { name: 'Pastís de xocolata' })).toHaveAttribute(
      'src',
      'https://example.com/pastis.jpg',
    )
    expect(screen.getByRole('heading', { name: 'Pastís de xocolata' })).toBeInTheDocument()
    expect(screen.getByText(/Des de 39,00\s€/)).toBeInTheDocument()
  })

  it('asks for the next page', async () => {
    // Given a first page of two
    const data = productPage({ total: 13, totalPages: 2 })
    vi.mocked(useProducts).mockReturnValue({ status: 'success', data, retry })
    render(<ProductsPage />)

    // When the user clicks next
    await userEvent.setup().click(screen.getByRole('button', { name: 'Següent »' }))

    // Then the second page is requested
    expect(useProducts).toHaveBeenLastCalledWith(2)
  })

    it('shows the placeholder when the product has no image', () => {
    // Given a product without image
    const [product] = productPage().items
    const data = productPage({ items: [{ ...product!, imageUrl: null }] })
    vi.mocked(useProducts).mockReturnValue({ status: 'success', data, retry })

    // When the page is shown
    render(<ProductsPage />)

    // Then the card shows the placeholder image
    expect(screen.getByRole('img', { name: 'Pastís de xocolata' })).toHaveAttribute(
      'src',
      noProductImage,
    )
  })

  it('does not show the pagination when there is only one page', () => {
    // Given a single page of products
    vi.mocked(useProducts).mockReturnValue({ status: 'success', data: productPage(), retry })

    // When the page is shown
    render(<ProductsPage />)

    // Then there are no page buttons
    expect(screen.queryByRole('navigation', { name: 'Paginació' })).not.toBeInTheDocument()
  })
})
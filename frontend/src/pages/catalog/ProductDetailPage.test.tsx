import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProduct } from '../../features/catalog/hooks/useProduct'
import type { Product } from '../../features/catalog/types/product'
import ProductDetailPage from './ProductDetailPage'
import { CartProvider } from '../../features/cart/CartProvider'
import { loadCart } from '../../features/cart/services/cartStorage'

vi.mock('../../features/catalog/hooks/useProduct', () => ({ useProduct: vi.fn() }))

const retry = vi.fn()

const product: Product = {
  id: 7,
  name: 'Pastís de xocolata',
  description: 'Pastís amb cobertura de xocolata',
  imageUrl: null,
  allergens: 'gluten, ou',
  isGlutenFree: false,
  isPlantMilk: true,
  isVegan: true,
  category: { id: 1, name: 'Pastissos', slug: 'pastissos' },
  variants: [
    { id: 11, name: '6 racions', priceCents: 3900, inStock: false },
    { id: 12, name: '10 racions', priceCents: 4900, inStock: true },
    { id: 13, name: '14 racions', priceCents: 6500, inStock: true },
  ],
}

const renderPage = () =>
  render(
    <CartProvider>
      <MemoryRouter initialEntries={['/productes/7']}>
        <Routes>
          <Route path="/productes/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>,
  )

const showProduct = (shownProduct: Product = product) =>
  vi.mocked(useProduct).mockReturnValue({ status: 'success', product: shownProduct, retry })

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('asks for the product of the URL while it is loading', () => {
    // Given the product is loading
    vi.mocked(useProduct).mockReturnValue({ status: 'loading', retry })

    // When the page is opened
    renderPage()

    // Then the id of the URL is requested and the loading message is shown
    expect(useProduct).toHaveBeenCalledWith('7')
    expect(screen.getByText('Carregant el producte...')).toBeInTheDocument()
  })

  it('shows an error and lets the user retry', async () => {
    // Given the product could not be loaded
    vi.mocked(useProduct).mockReturnValue({ status: 'error', retry })
    renderPage()

    // When the user clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the error is shown and the product is requested again
    expect(screen.getByText("No s'ha pogut carregar el producte.")).toBeInTheDocument()
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows the not found page when the product does not exist', () => {
    // Given a product that does not exist
    vi.mocked(useProduct).mockReturnValue({ status: 'not-found', retry })

    // When the page is opened
    renderPage()

    // Then the not found page is shown
    expect(screen.getByRole('heading', { name: 'Pàgina no trobada' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '« Torna als productes' })).not.toBeInTheDocument()
  })

  it('shows the product with the first variant in stock selected', () => {
    // Given a product with its first variant sold out
    showProduct()

    // When the page is opened
    renderPage()

    // Then the data is shown and the second variant is selected
    expect(screen.getByRole('heading', { name: 'Pastís de xocolata' })).toBeInTheDocument()
    expect(screen.getByText('Vegà')).toBeInTheDocument()
    expect(screen.getByText('Al·lèrgens: gluten, ou')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /10 racions/ })).toBeChecked()
    expect(screen.getByText(/^49,00\s€$/, { selector: 'p' })).toBeInTheDocument()
  })

  it('changes the price when another variant is chosen', async () => {
    // Given a product with two variants in stock
    showProduct()
    renderPage()

    // When the user chooses the other variant
    await userEvent.setup().click(screen.getByRole('radio', { name: /14 racions/ }))

    // Then the price changes
    expect(screen.getByText(/^65,00\s€$/, { selector: 'p' })).toBeInTheDocument()
  })

  it('does not let the user choose a sold out variant', () => {
    // Given a variant without stock
    showProduct()

    // When the page is opened
    renderPage()

    // Then it can not be chosen
    expect(screen.getByRole('radio', { name: /6 racions/ })).toBeDisabled()
  })

  it('shows sold out when no variant has stock', () => {
    // Given a product with all the variants sold out
    showProduct({ ...product, variants: [{ ...product.variants[0]! }] })

    // When the page is opened
    renderPage()

    // Then the product shows it is sold out and nothing is selected
    expect(screen.getByText('Esgotat', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /6 racions/ })).not.toBeChecked()
  })

  it('has a link back to the products', () => {
    // Given a product
    showProduct()

    // When the page is opened
    renderPage()

    // Then the user can go back to the list
    expect(screen.getByRole('link', { name: '« Torna als productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
  })

    it('adds the chosen variant to the cart', async () => {
    // Given a product with a variant chosen
    showProduct()
    renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByRole('radio', { name: /14 racions/ }))

    // When the visitor adds it to the cart
    await user.click(screen.getByRole('button', { name: 'Afegeix al carretó' }))

    // Then that variant is in the cart and the page confirms it
    expect(loadCart()).toEqual([
      {
        variantId: 13,
        productId: 7,
        productName: 'Pastís de xocolata',
        variantName: '14 racions',
        priceCents: 6500,
        imageUrl: null,
        quantity: 1,
      },
    ])
    expect(screen.getByRole('link', { name: 'Veure el carretó' })).toHaveAttribute(
      'href',
      '/carreto',
    )
  })

  it('hides the confirmation when another variant is chosen', async () => {
    // Given a variant that was just added
    showProduct()
    renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Afegeix al carretó' }))

    // When the visitor chooses another variant
    await user.click(screen.getByRole('radio', { name: /14 racions/ }))

    // Then the confirmation is gone
    expect(screen.queryByRole('link', { name: 'Veure el carretó' })).not.toBeInTheDocument()
  })

  it('does not let the visitor add a sold out product', () => {
    // Given a product with all the variants sold out
    showProduct({ ...product, variants: [{ ...product.variants[0]! }] })

    // When the page is opened
    renderPage()

    // Then the button can not be used
    expect(screen.getByRole('button', { name: 'Afegeix al carretó' })).toBeDisabled()
  })
})

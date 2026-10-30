import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { AdminProduct } from '../types/product'
import ProductsTable from './ProductsTable'

const product: AdminProduct = {
  id: 7,
  name: 'Pastís de xocolata',
  isActive: true,
  category: { id: 1, name: 'Pastissos' },
  variants: [
    { id: 12, name: '6 racions', priceCents: 3900, stock: 5, isActive: true },
    { id: 13, name: '10 racions', priceCents: 4900, stock: 7, isActive: false },
  ],
}

const renderTable = (overrides: Partial<AdminProduct> = {}, pendingKey: string | null = null) => {
  const onToggleProduct = vi.fn()
  const onToggleVariant = vi.fn()
  const shownProduct = { ...product, ...overrides }

  render(
    <ProductsTable
      products={[shownProduct]}
      pendingKey={pendingKey}
      onToggleProduct={onToggleProduct}
      onToggleVariant={onToggleVariant}
    />,
  )

  return { shownProduct, onToggleProduct, onToggleVariant }
}

const showVariants = () =>
  userEvent.setup().click(screen.getByRole('button', { name: 'Mostra les variants de Pastís de xocolata' }))

describe('ProductsTable', () => {
  it('toggles an active product', async () => {
    // Given an active product
    const { shownProduct, onToggleProduct } = renderTable()

    // When the admin clicks deactivate
    await userEvent.setup().click(screen.getByRole('button', { name: 'Desactiva Pastís de xocolata' }))

    // Then the table asks to toggle that product
    expect(onToggleProduct).toHaveBeenCalledWith(shownProduct)
  })

  it('offers to activate an inactive product', () => {
    // Given an inactive product
    renderTable({ isActive: false })

    // When the table is shown
    // Then the status and the button say so
    expect(screen.getByText('Inactiu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activa Pastís de xocolata' })).toBeInTheDocument()
  })

  it('hides the variants until the admin asks for them', async () => {
    // Given a product with variants
    renderTable()
    expect(screen.queryByText('6 racions')).not.toBeInTheDocument()

    // When the admin shows the variants
    await showVariants()

    // Then the variants are visible
    expect(screen.getByText('6 racions')).toBeInTheDocument()
    expect(screen.getByText('10 racions')).toBeInTheDocument()
  })

  it('toggles a variant of the product', async () => {
    // Given the variants are visible
    const { shownProduct, onToggleVariant } = renderTable()
    await showVariants()

    // When the admin activates the second variant
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Activa la variant 10 racions de Pastís de xocolata' }))

    // Then the table asks to toggle that variant of that product
    expect(onToggleVariant).toHaveBeenCalledWith(shownProduct, shownProduct.variants[1])
  })

  it('blocks the buttons while a change is being saved', () => {
    // Given the product is being saved
    renderTable({}, 'product-7')

    // When the table is shown
    // Then the button shows it is saving and can not be clicked
    const button = screen.getByRole('button', { name: 'Desactiva Pastís de xocolata' })
    expect(button).toHaveTextContent('Desant...')
    expect(button).toBeDisabled()
  })
})
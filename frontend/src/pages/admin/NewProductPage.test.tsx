import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdminProduct } from '../../features/admin/services/adminProductsApi'
import { fetchCategories } from '../../features/admin/services/categoriesApi'
import { useAuth } from '../../features/auth/hooks/useAuth'
import NewProductPage from './NewProductPage'

vi.mock('../../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../../features/admin/services/adminProductsApi', () => ({ createAdminProduct: vi.fn() }))
vi.mock('../../features/admin/services/categoriesApi', () => ({ fetchCategories: vi.fn() }))

const categories = [
  { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
  { id: 1, name: 'Pastissos', slug: 'pastissos' },
]

const ProductsListProbe = () => {
  const state = useLocation().state as { notice?: string } | null

  return <p>Llista: {state?.notice}</p>
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/productes/nou']}>
      <Routes>
        <Route path="/admin/productes/nou" element={<NewProductPage />} />
        <Route path="/admin/productes" element={<ProductsListProbe />} />
      </Routes>
    </MemoryRouter>,
  )

const fillValidForm = async () => {
  const user = userEvent.setup()
  await screen.findByRole('option', { name: 'Pastissos' })
  await user.selectOptions(screen.getByLabelText('Categoria'), 'Pastissos')
  await user.type(screen.getByLabelText('Nom del producte'), 'Pastís de maduixa')
  await user.type(screen.getByLabelText('Descripció'), 'Bescuit amb nata i maduixes')
  const variant = within(screen.getByRole('group', { name: 'Variant 1' }))
  await user.type(variant.getByLabelText('Nom'), '6 racions')
  await user.type(variant.getByLabelText('Preu (€)'), '39,50')
  await user.type(variant.getByLabelText('Stock'), '5')

  return user
}

describe('NewProductPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
    vi.mocked(fetchCategories).mockResolvedValue(categories)
  })

  it('shows the categories to choose', async () => {
    // Given two categories in the backend
    // When the form is shown
    renderPage()

    // Then both categories can be chosen
    expect(await screen.findByRole('option', { name: 'Cupcakes' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pastissos' })).toBeInTheDocument()
  })

  it('shows the errors and does not send an empty form', async () => {
    // Given an empty form
    renderPage()
    await screen.findByRole('option', { name: 'Pastissos' })

    // When the admin saves it
    await userEvent.setup().click(screen.getByRole('button', { name: 'Desa el producte' }))

    // Then the fields are marked and nothing is sent
    expect(screen.getByLabelText('Categoria')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('El nom ha de tenir entre 2 i 100 caràcters')).toBeInTheDocument()
    expect(createAdminProduct).not.toHaveBeenCalled()
  })

  it('adds and removes variants', async () => {
    // Given the form with one variant
    renderPage()
    const user = userEvent.setup()

    // When the admin adds a variant and removes it again
    await user.click(screen.getByRole('button', { name: '+ Afegeix una variant' }))
    expect(screen.getByRole('group', { name: 'Variant 2' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Treu la variant 2' }))

    // Then only the first one is left and it can not be removed
    expect(screen.queryByRole('group', { name: 'Variant 2' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Treu la variant 1' })).toBeDisabled()
  })

  it('creates the product and goes back to the list with a notice', async () => {
    // Given a backend that creates the product
    vi.mocked(createAdminProduct).mockResolvedValue({ id: 10, name: 'Pastís de maduixa' } as never)
    renderPage()
    const user = await fillValidForm()

    // When the admin saves the form
    await user.click(screen.getByRole('button', { name: 'Desa el producte' }))

    // Then the product is sent in cents and the list shows the notice
    expect(
      await screen.findByText('Llista: Producte "Pastís de maduixa" creat correctament'),
    ).toBeInTheDocument()
    expect(createAdminProduct).toHaveBeenCalledWith(
      'token-123',
      expect.objectContaining({
        categoryId: 1,
        variants: [{ name: '6 racions', priceCents: 3950, stock: 5 }],
      }),
    )
  })

  it('shows the message of the backend when it fails', async () => {
    // Given a backend that rejects the product
    vi.mocked(createAdminProduct).mockRejectedValue(new Error('La categoria no existeix'))
    renderPage()
    const user = await fillValidForm()

    // When the admin saves the form
    await user.click(screen.getByRole('button', { name: 'Desa el producte' }))

    // Then the message is shown and the admin stays in the form
    expect(await screen.findByText('La categoria no existeix')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nou producte' })).toBeInTheDocument()
  })
})
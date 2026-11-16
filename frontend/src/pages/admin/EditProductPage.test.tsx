import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminProduct } from '../../features/admin/hooks/useAdminProduct'
import { updateAdminProduct } from '../../features/admin/services/adminProductsApi'
import { fetchCategories } from '../../features/admin/services/categoriesApi'
import type { AdminProductDetail } from '../../features/admin/types/product'
import { useAuth } from '../../features/auth/hooks/useAuth'
import EditProductPage from './EditProductPage'

vi.mock('../../features/auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../../features/admin/hooks/useAdminProduct', () => ({ useAdminProduct: vi.fn() }))
vi.mock('../../features/admin/services/adminProductsApi', () => ({ updateAdminProduct: vi.fn() }))
vi.mock('../../features/admin/services/categoriesApi', () => ({ fetchCategories: vi.fn() }))

const retry = vi.fn()

const product: AdminProductDetail = {
  id: 7,
  name: 'Pastís de xocolata',
  isActive: true,
  category: { id: 1, name: 'Pastissos' },
  categoryId: 1,
  description: 'Amb cacau pur',
  allergens: null,
  imageUrl: null,
  isGlutenFree: false,
  isPlantMilk: false,
  isVegan: false,
  variants: [{ id: 12, name: '6 racions', priceCents: 3900, stock: 5, isActive: true }],
}

const ProductsListProbe = () => {
  const state = useLocation().state as { notice?: string } | null

  return <p>Llista: {state?.notice}</p>
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/productes/7/editar']}>
      <Routes>
        <Route path="/admin/productes/:id/editar" element={<EditProductPage />} />
        <Route path="/admin/productes" element={<ProductsListProbe />} />
      </Routes>
    </MemoryRouter>,
  )

describe('EditProductPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
    vi.mocked(fetchCategories).mockResolvedValue([{ id: 1, name: 'Pastissos', slug: 'pastissos' }])
  })

  it('shows the form with the saved product', async () => {
    // Given a saved product
    vi.mocked(useAdminProduct).mockReturnValue({ status: 'success', product, retry })

    // When the admin opens the page
    renderPage()

    // Then the form is filled with the product
    await screen.findByRole('option', { name: 'Pastissos' })
    expect(useAdminProduct).toHaveBeenCalledWith('7')
    expect(screen.getByLabelText('Nom del producte')).toHaveValue('Pastís de xocolata')
    expect(screen.getByLabelText('Preu (€)')).toHaveValue('39,00')
  })

  it('saves the changes and goes back to the list', async () => {
    // Given the form of a saved product
    vi.mocked(useAdminProduct).mockReturnValue({ status: 'success', product, retry })
    vi.mocked(updateAdminProduct).mockResolvedValue({ ...product, name: 'Pastís de cacau' })
    const user = userEvent.setup({ delay: null })
    renderPage()
    await screen.findByRole('option', { name: 'Pastissos' })

    // When the admin changes the price and saves
    await user.clear(screen.getByLabelText('Preu (€)'))
    await user.type(screen.getByLabelText('Preu (€)'), '42')
    await user.click(screen.getByRole('button', { name: 'Desa el producte' }))

    // Then the product is updated keeping the variant id and the list shows a message
    expect(updateAdminProduct).toHaveBeenCalledWith(
      'token-123',
      7,
      expect.objectContaining({
        variants: [{ id: 12, name: '6 racions', priceCents: 4200, stock: 5 }],
      }),
    )
    expect(
      await screen.findByText('Llista: Producte "Pastís de cacau" desat correctament'),
    ).toBeInTheDocument()
  })

  it('shows the not found page when the product does not exist', () => {
    // Given an id without product
    vi.mocked(useAdminProduct).mockReturnValue({ status: 'not-found', retry })

    // When the admin opens the page
    renderPage()

    // Then the not found page is shown
    expect(screen.getByRole('heading', { name: 'Pàgina no trobada' })).toBeInTheDocument()
  })
})

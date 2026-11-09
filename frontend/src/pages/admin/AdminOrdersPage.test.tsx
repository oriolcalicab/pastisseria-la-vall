import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminOrders } from '../../features/admin/hooks/useAdminOrders'
import type { AdminOrderPage } from '../../features/admin/types/order'
import AdminOrdersPage from './AdminOrdersPage'

vi.mock('../../features/admin/hooks/useAdminOrders', () => ({ useAdminOrders: vi.fn() }))

const retry = vi.fn()

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdminOrdersPage />
    </MemoryRouter>,
  )

const orderPage: AdminOrderPage = {
  items: [
    {
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      status: 'pending',
      deliveryMethod: 'pickup',
      deliveryDate: '2026-11-12',
      totalCents: 7800,
      createdAt: '2026-11-06T10:00:00.000Z',
      user: { name: 'Anna Puig', email: 'anna@test.com' },
    },
  ],
  page: 1,
  pageSize: 20,
  total: 41,
  totalPages: 3,
}

describe('AdminOrdersPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the first page of all the orders', () => {
    // Given a backend with orders
    vi.mocked(useAdminOrders).mockReturnValue({ status: 'success', data: orderPage, retry })

    // When the admin opens the page
    renderPage()

    // Then the first page of all the orders is shown
    expect(useAdminOrders).toHaveBeenLastCalledWith({ page: 1, status: '' })
    expect(screen.getByText('LV-261106-4F2A9C')).toBeInTheDocument()
    expect(screen.getByText('Pàgina 1 de 3')).toBeInTheDocument()
  })

  it('goes back to the first page when the status changes', async () => {
    // Given the admin on the second page
    vi.mocked(useAdminOrders).mockReturnValue({ status: 'success', data: orderPage, retry })
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Següent »' }))
    expect(useAdminOrders).toHaveBeenLastCalledWith({ page: 2, status: '' })

    // When the admin chooses the ready orders
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estat' }), 'Llesta')

    // Then the first page of the ready orders is asked
    expect(useAdminOrders).toHaveBeenLastCalledWith({ page: 1, status: 'ready' })
  })

  it('tells the admin when no order has the chosen status', async () => {
    // Given a status without orders
    vi.mocked(useAdminOrders).mockReturnValue({
      status: 'success',
      data: { ...orderPage, items: [], total: 0, totalPages: 0 },
      retry,
    })
    renderPage()

    // When the admin chooses that status
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Estat' }), 'Cancel·lada')

    // Then a message is shown
    expect(screen.getByText('No hi ha cap comanda amb aquest estat.')).toBeInTheDocument()
  })
})

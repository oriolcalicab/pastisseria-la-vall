import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOrders } from '../../features/orders/hooks/useOrders'
import type { OrderSummary } from '../../features/orders/types/order'
import OrdersPage from './OrdersPage'

vi.mock('../../features/orders/hooks/useOrders', () => ({ useOrders: vi.fn() }))

const retry = vi.fn()

const renderPage = () =>
  render(
    <MemoryRouter>
      <OrdersPage />
    </MemoryRouter>,
  )

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the orders of the customer', () => {
    // Given a customer with one order
    const order: OrderSummary = {
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      status: 'pending',
      deliveryMethod: 'pickup',
      deliveryDate: '2026-11-12',
      totalCents: 7800,
      createdAt: '2026-11-06T10:00:00.000Z',
    }
    vi.mocked(useOrders).mockReturnValue({ status: 'success', orders: [order], retry })

    // When the page is opened
    renderPage()

    // Then the order is shown
    expect(screen.getByRole('heading', { name: 'LV-261106-4F2A9C' })).toBeInTheDocument()
  })

  it('tells the customer when there are no orders yet', () => {
    // Given a customer without orders
    vi.mocked(useOrders).mockReturnValue({ status: 'success', orders: [], retry })

    // When the page is opened
    renderPage()

    // Then a message and a link to the products are shown
    expect(screen.getByText('Encara no has fet cap comanda.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mira els productes' })).toHaveAttribute(
      'href',
      '/productes',
    )
  })

  it('shows an error and lets the customer retry', async () => {
    // Given a backend that fails
    vi.mocked(useOrders).mockReturnValue({ status: 'error', retry })
    renderPage()

    // When the customer retries
    await userEvent.click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the orders are asked again
    expect(screen.getByRole('alert')).toHaveTextContent("No s'han pogut carregar les comandes.")
    expect(retry).toHaveBeenCalledOnce()
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOrder } from '../../features/orders/hooks/useOrder'
import type { OrderDetail } from '../../features/orders/types/order'
import OrderDetailPage from './OrderDetailPage'

vi.mock('../../features/orders/hooks/useOrder', () => ({ useOrder: vi.fn() }))

const retry = vi.fn()

const order: OrderDetail = {
  id: 1,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'ready',
  deliveryMethod: 'pickup',
  deliveryDate: '2026-11-12',
  shippingAddress: null,
  shippingCity: null,
  shippingPostalCode: null,
  subtotalCents: 7800,
  shippingCents: 0,
  totalCents: 7800,
  createdAt: '2026-11-06T10:00:00.000Z',
  pickupPoint: {
    name: 'La Vall · Eixample',
    address: 'Carrer de Girona, 84',
    city: 'Barcelona',
    openingHours: 'De dt. a ds., de 9 a 19 h',
  },
  items: [
    {
      id: 1,
      productName: 'Pastís de xocolata',
      variantName: '6 racions',
      unitPriceCents: 3900,
      quantity: 2,
      lineTotalCents: 7800,
    },
  ],
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/comandes/1']}>
      <Routes>
        <Route path="/comandes/:id" element={<OrderDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('OrderDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the order with the prices that were paid and the pickup point', () => {
    // Given an order of the customer
    vi.mocked(useOrder).mockReturnValue({ status: 'success', order, retry })

    // When the page is opened
    renderPage()

    // Then the order of the URL is shown with its status, prices and pickup point
    expect(useOrder).toHaveBeenCalledWith('1')
    expect(screen.getByRole('heading', { name: 'Comanda LV-261106-4F2A9C' })).toBeInTheDocument()
    expect(screen.getByText('Llesta')).toBeInTheDocument()
    expect(screen.getByText('Feta el 6 de novembre del 2026')).toBeInTheDocument()
    expect(screen.getByText(/^39,00\s€ \/ unitat$/)).toBeInTheDocument()
    expect(
      screen.getByText('Recollida a La Vall · Eixample (Carrer de Girona, 84)'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '« Torna a les meves comandes' })).toHaveAttribute(
      'href',
      '/comandes',
    )
  })

  it('shows the not found page when the order is of another customer', () => {
    // Given an order that the customer can not see
    vi.mocked(useOrder).mockReturnValue({ status: 'not-found', retry })

    // When the page is opened
    renderPage()

    // Then the not found page is shown
    expect(screen.getByRole('heading', { name: 'Pàgina no trobada' })).toBeInTheDocument()
  })
})

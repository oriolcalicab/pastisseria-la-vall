import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminOrder } from '../../features/admin/hooks/useAdminOrder'
import type { AdminOrderDetail } from '../../features/admin/types/order'
import AdminOrderDetailPage from './AdminOrderDetailPage'

vi.mock('../../features/admin/hooks/useAdminOrder', () => ({ useAdminOrder: vi.fn() }))
vi.mock('../../features/admin/hooks/useChangeOrderStatus', () => ({
  useChangeOrderStatus: () => ({
    pendingStatus: null,
    error: null,
    notice: null,
    changeStatus: vi.fn(),
  }),
}))

const retry = vi.fn()
const replaceOrder = vi.fn()

const deliveryOrder: AdminOrderDetail = {
  id: 7,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'preparing',
  deliveryMethod: 'delivery',
  deliveryDate: '2026-11-12',
  shippingAddress: 'Carrer de Mallorca, 120',
  shippingCity: 'Barcelona',
  shippingPostalCode: '08036',
  subtotalCents: 7800,
  shippingCents: 500,
  totalCents: 8300,
  createdAt: '2026-11-06T10:00:00.000Z',
  pickupPoint: null,
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
  user: { name: 'Anna Puig', email: 'anna@test.com' },
  allowedStatuses: ['ready', 'cancelled'],
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/comandes/7']}>
      <Routes>
        <Route path="/admin/comandes/:id" element={<AdminOrderDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminOrderDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the customer, the products and a map link of a home delivery', () => {
    // Given a home delivery order
    vi.mocked(useAdminOrder).mockReturnValue({
      status: 'success',
      order: deliveryOrder,
      retry,
      replaceOrder,
    })

    // When the admin opens the order
    renderPage()

    // Then the customer, the products and the map link are shown
    expect(useAdminOrder).toHaveBeenCalledWith('7')
    expect(screen.getByRole('heading', { name: 'Comanda LV-261106-4F2A9C' })).toBeInTheDocument()
    expect(screen.getByText('Anna Puig')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'anna@test.com' })).toHaveAttribute(
      'href',
      'mailto:anna@test.com',
    )
    expect(screen.getByText('2 × Pastís de xocolata (6 racions)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Veure l'adreça al mapa/ })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps/search'),
    )
  })

  it('does not show the map link for a pickup', () => {
    // Given a pickup order
    const pickupOrder: AdminOrderDetail = {
      ...deliveryOrder,
      deliveryMethod: 'pickup',
      shippingAddress: null,
      shippingCity: null,
      shippingPostalCode: null,
      shippingCents: 0,
      pickupPoint: {
        name: 'La Vall · Eixample',
        address: 'Carrer de Girona, 84',
        city: 'Barcelona',
        openingHours: 'De dt. a ds., de 9 a 19 h',
      },
    }
    vi.mocked(useAdminOrder).mockReturnValue({
      status: 'success',
      order: pickupOrder,
      retry,
      replaceOrder,
    })

    // When the admin opens the order
    renderPage()

    // Then the pickup point is shown without a map link
    expect(
      screen.getByText('Recollida a La Vall · Eixample (Carrer de Girona, 84)'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Veure l'adreça al mapa/ })).not.toBeInTheDocument()
  })

  it('shows the not found page when the order does not exist', () => {
    // Given an id without order
    vi.mocked(useAdminOrder).mockReturnValue({ status: 'not-found', retry, replaceOrder })

    // When the admin opens it
    renderPage()

    // Then the not found page is shown
    expect(screen.getByRole('heading', { name: 'Pàgina no trobada' })).toBeInTheDocument()
  })
})

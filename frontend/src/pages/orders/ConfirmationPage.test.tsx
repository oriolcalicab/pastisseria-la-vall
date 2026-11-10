import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOrder } from '../../features/orders/hooks/useOrder'
import type { OrderDetail } from '../../features/orders/types/order'
import ConfirmationPage from './ConfirmationPage'

vi.mock('../../features/orders/hooks/useOrder', () => ({ useOrder: vi.fn() }))

const retry = vi.fn()

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/confirmacio/1']}>
      <Routes>
        <Route path="/confirmacio/:id" element={<ConfirmationPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('ConfirmationPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the order of the URL', () => {
    // Given an order of the customer
    const order = {
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      deliveryMethod: 'pickup',
      deliveryDate: '2026-11-12',
      pickupPoint: null,
      items: [],
      subtotalCents: 0,
      shippingCents: 0,
      totalCents: 0,
    } as unknown as OrderDetail
    vi.mocked(useOrder).mockReturnValue({ status: 'success', order, retry })

    // When the page is opened
    renderPage()

    // Then the order of the URL is shown
    expect(useOrder).toHaveBeenCalledWith('1')
    expect(screen.getByText('LV-261106-4F2A9C')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continua comprant' })).toHaveAttribute(
      'href',
      '/productes',
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

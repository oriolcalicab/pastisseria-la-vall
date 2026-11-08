import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { OrderSummary } from '../types/order'
import OrdersList from './OrdersList'
import { MemoryRouter } from 'react-router-dom'

const order: OrderSummary = {
  id: 1,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'preparing',
  deliveryMethod: 'delivery',
  deliveryDate: '2026-11-12',
  totalCents: 8300,
  createdAt: '2026-11-06T10:00:00.000Z',
}

describe('OrdersList', () => {
  it('shows the dates, the method, the total and the status of each order', () => {
    // Given an order of the customer
    // When the list is shown
    render(
      <MemoryRouter>
        <OrdersList orders={[order]} />
      </MemoryRouter>,
    )
    // Then all the data of the order is shown
    expect(screen.getByRole('heading', { name: 'LV-261106-4F2A9C' })).toBeInTheDocument()
    expect(screen.getByText('En preparació')).toBeInTheDocument()
    expect(screen.getByText('6 de novembre del 2026')).toBeInTheDocument()
    expect(screen.getByText(/12 de novembre/)).toBeInTheDocument()
    expect(screen.getByText('A domicili')).toBeInTheDocument()
    expect(screen.getByText(/^83,00\s€$/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LV-261106-4F2A9C' })).toHaveAttribute(
      'href',
      '/comandes/1',
    )
  })
})

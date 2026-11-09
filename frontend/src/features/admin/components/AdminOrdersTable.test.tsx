import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { AdminOrderSummary } from '../types/order'
import AdminOrdersTable from './AdminOrdersTable'
import { MemoryRouter } from 'react-router-dom'

const order: AdminOrderSummary = {
  id: 1,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'pending',
  deliveryMethod: 'pickup',
  deliveryDate: '2026-11-12',
  totalCents: 7800,
  createdAt: '2026-11-06T10:00:00.000Z',
  user: { name: 'Anna Puig', email: 'anna@test.com' },
}

describe('AdminOrdersTable', () => {
  it('shows each order with its customer', () => {
    // Given an order of a customer
    // When the table is shown
    render(
      <MemoryRouter>
        <AdminOrdersTable orders={[order]} />
      </MemoryRouter>,
    )
    // Then the columns and the data of the order are shown
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
    expect(screen.getByText('LV-261106-4F2A9C')).toBeInTheDocument()
    expect(screen.getByText('Anna Puig')).toBeInTheDocument()
    expect(screen.getByText('anna@test.com')).toBeInTheDocument()
    expect(screen.getByText('Recollida')).toBeInTheDocument()
    expect(screen.getByText('Pendent')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LV-261106-4F2A9C' })).toHaveAttribute(
      'href',
      '/admin/comandes/1',
    )
  })
})

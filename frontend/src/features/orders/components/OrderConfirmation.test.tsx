import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { OrderDetail } from '../types/order'
import OrderConfirmation from './OrderConfirmation'

const pickupOrder: OrderDetail = {
  id: 1,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'pending',
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

describe('OrderConfirmation', () => {
  it('shows the number, the products and the pickup point of the order', () => {
    // Given a pickup order
    // When the confirmation is shown
    render(<OrderConfirmation order={pickupOrder} />)

    // Then the customer sees what was ordered and where to pick it up
    expect(screen.getByRole('heading', { name: 'Comanda confirmada' })).toBeInTheDocument()
    expect(screen.getByText('LV-261106-4F2A9C')).toBeInTheDocument()
    expect(screen.getByText(/12 de novembre/)).toBeInTheDocument()
    expect(
      screen.getByText('Recollida a La Vall · Eixample (Carrer de Girona, 84)'),
    ).toBeInTheDocument()
    expect(screen.getByText('2 × Pastís de xocolata (6 racions)')).toBeInTheDocument()
    expect(screen.getByText('Gratuït')).toBeInTheDocument()
  })

  it('shows the address and the shipping fee of a home delivery', () => {
    // Given a home delivery order
    const order: OrderDetail = {
      ...pickupOrder,
      deliveryMethod: 'delivery',
      pickupPoint: null,
      shippingAddress: 'Carrer de Mallorca, 120',
      shippingCity: 'Barcelona',
      shippingPostalCode: '08036',
      shippingCents: 500,
      totalCents: 8300,
    }

    // When the confirmation is shown
    render(<OrderConfirmation order={order} />)

    // Then the address and the totals are shown
    expect(
      screen.getByText('A domicili: Carrer de Mallorca, 120, 08036 Barcelona'),
    ).toBeInTheDocument()
    expect(screen.getByText(/^5,00\s€$/)).toBeInTheDocument()
    expect(screen.getByText(/^83,00\s€$/)).toBeInTheDocument()
  })
})

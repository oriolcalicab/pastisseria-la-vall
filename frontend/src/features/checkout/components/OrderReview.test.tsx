import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CartLine } from '../../cart/types/cart'
import type { ShippingFeeState } from '../hooks/useShippingFee'
import OrderReview from './OrderReview'

const lines: CartLine[] = [
  {
    variantId: 12,
    productId: 7,
    productName: 'Pastís de xocolata',
    variantName: '6 racions',
    priceCents: 3900,
    imageUrl: null,
    quantity: 2,
  },
  {
    variantId: 20,
    productId: 8,
    productName: 'Cupcakes de vainilla',
    variantName: 'Caixa de 4',
    priceCents: 1400,
    imageUrl: null,
    quantity: 1,
  },
]

const address = { address: 'Carrer de Mallorca, 120', city: 'Barcelona', postalCode: '08036' }

const pickupPoint = {
  id: 2,
  name: 'La Vall · Eixample',
  address: 'Carrer de Girona, 84',
  city: 'Barcelona',
  latitude: 41.3965,
  longitude: 2.1675,
  openingHours: 'De dt. a ds., de 9 a 19 h',
}

const retry = vi.fn()

const renderReview = (method: 'delivery' | 'pickup', shippingFee: ShippingFeeState) =>
  render(
    <OrderReview
      lines={lines}
      subtotalCents={9200}
      deliveryDate="2026-11-12"
      method={method}
      address={address}
      pickupPoint={pickupPoint}
      shippingFee={shippingFee}
    />,
  )

describe('OrderReview', () => {
  it('shows everything of a home delivery with its shipping fee', () => {
    // Given a home delivery with a fee of 500 cents
    // When the review is shown
    renderReview('delivery', { status: 'success', feeCents: 500, retry })

    // Then it shows the date, the address, the products, the shipping and the total
    expect(screen.getByText(/dijous.*12.*novembre/)).toBeInTheDocument()
    expect(screen.getByText('Carrer de Mallorca, 120, 08036 Barcelona')).toBeInTheDocument()
    expect(screen.getByText('1 × Cupcakes de vainilla (Caixa de 4)')).toBeInTheDocument()
    expect(screen.getByText(/^92,00\s€$/)).toBeInTheDocument()
    expect(screen.getByText(/^5,00\s€$/)).toBeInTheDocument()
    expect(screen.getByText(/^97,00\s€$/)).toBeInTheDocument()
  })

  it('does not charge shipping for a pickup', () => {
    // Given a pickup
    // When the review is shown
    renderReview('pickup', { status: 'success', feeCents: 500, retry })

    // Then the shipping is free and the total is the subtotal
    expect(screen.getByText('La Vall · Eixample, Carrer de Girona, 84, Barcelona')).toBeInTheDocument()
    expect(screen.getByText('Gratuït')).toBeInTheDocument()
    expect(screen.getAllByText(/^92,00\s€$/)).toHaveLength(2)
  })

  it('does not show a total while the fee is loading', () => {
    // Given a home delivery while the fee is loading
    // When the review is shown
    renderReview('delivery', { status: 'loading', retry })

    // Then there is no total yet
    expect(screen.getByText('Calculant...')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('lets the customer retry when the fee can not be loaded', async () => {
    // Given a home delivery whose fee could not be loaded
    renderReview('delivery', { status: 'error', retry })

    // When the customer retries
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: "No s'ha pogut calcular. Torna-ho a provar" }))

    // Then the fee is requested again
    expect(retry).toHaveBeenCalledOnce()
  })
})
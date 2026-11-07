import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { OrderRequestError } from '../services/checkoutApi'
import OrderErrorNotice from './OrderErrorNotice'

const renderNotice = (error: OrderRequestError) => {
  const onChangeDate = vi.fn()
  const onChangePickupPoint = vi.fn()

  render(
    <MemoryRouter>
      <OrderErrorNotice
        error={error}
        onChangeDate={onChangeDate}
        onChangePickupPoint={onChangePickupPoint}
      />
    </MemoryRouter>,
  )

  return { onChangeDate, onChangePickupPoint }
}

describe('OrderErrorNotice', () => {
  it('lets the customer choose another date when the day is full', async () => {
    // Given an order rejected because the date is no longer available
    const { onChangeDate } = renderNotice(
      new OrderRequestError('La data de lliurament ja no està disponible', [], 'date_unavailable'),
    )

    // When the customer clicks the button
    await userEvent.click(screen.getByRole('button', { name: 'Tria una altra data' }))

    // Then the message is shown and the customer goes back to the dates
    expect(screen.getByRole('alert')).toHaveTextContent(
      'La data de lliurament ja no està disponible',
    )
    expect(onChangeDate).toHaveBeenCalledOnce()
  })

  it('lets the customer choose another pickup point when it was deactivated', async () => {
    // Given an order rejected because the pickup point is no longer available
    const { onChangePickupPoint } = renderNotice(
      new OrderRequestError(
        'El punt de recollida ja no està disponible',
        [],
        'pickup_point_unavailable',
      ),
    )

    // When the customer clicks the button
    await userEvent.click(screen.getByRole('button', { name: 'Tria un altre punt de recollida' }))

    // Then the customer goes back to the pickup points
    expect(onChangePickupPoint).toHaveBeenCalledOnce()
  })

  it('sends the customer to the cart when the cart changed', () => {
    // Given an order rejected because a product changed
    renderNotice(
      new OrderRequestError(
        'Alguns productes han canviat. Revisa el carretó',
        [{ variantId: 12, type: 'price_changed' }],
        'cart_changed',
      ),
    )

    // Then there is a link to the cart
    expect(screen.getByRole('link', { name: 'Revisa el carretó' })).toHaveAttribute(
      'href',
      '/carreto',
    )
  })

  it('only shows the message when there is no reason', () => {
    // Given an order that could not be sent
    renderNotice(new OrderRequestError("No s'ha pogut confirmar la comanda. Torna-ho a provar"))

    // Then there is no button or link
    expect(screen.getByRole('alert')).toHaveTextContent("No s'ha pogut confirmar la comanda")
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})

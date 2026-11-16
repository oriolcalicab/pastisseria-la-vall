import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminOrder } from '../../hooks/useAdminOrder'
import type { AdminOrderDetail } from '../../types/order'
import OrderSummaryPanel from './OrderSummaryPanel'

type FakeActionsProps = {
  order: AdminOrderDetail
  onChange: (order: AdminOrderDetail) => void
}

vi.mock('../../hooks/useAdminOrder', () => ({ useAdminOrder: vi.fn() }))
vi.mock('../OrderStatusActions', () => ({
  default: ({ order, onChange }: FakeActionsProps) => (
    <button type="button" onClick={() => onChange({ ...order, status: 'preparing' })}>
      Passa a En preparació
    </button>
  ),
}))

const order = {
  id: 7,
  orderNumber: 'LV-261106-4F2A9C',
  status: 'pending',
  deliveryMethod: 'pickup',
  deliveryDate: '2026-11-12',
  totalCents: 3900,
  user: { name: 'Anna', email: 'anna@test.com' },
  allowedStatuses: ['preparing', 'cancelled'],
} as AdminOrderDetail

const replaceOrder = vi.fn()
const retry = vi.fn()
const onClose = vi.fn()
const onStatusChange = vi.fn()

const renderPanel = () =>
  render(
    <MemoryRouter>
      <OrderSummaryPanel orderId={7} onClose={onClose} onStatusChange={onStatusChange} />
    </MemoryRouter>,
  )

describe('OrderSummaryPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useAdminOrder).mockReturnValue({ status: 'success', order, retry, replaceOrder })
  })

  it('shows the summary of the order with a link to the detail', () => {
    // Given a pending order to pick up
    // When the admin opens its summary
    renderPanel()

    // Then the summary has the focus and the main data
    expect(screen.getByRole('heading', { name: 'Resum de la comanda' })).toHaveFocus()
    expect(screen.getByText('LV-261106-4F2A9C')).toBeInTheDocument()
    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByText('Recollida')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Veure el detall' })).toHaveAttribute(
      'href',
      '/admin/comandes/7',
    )
  })

  it('updates the summary and the calendar when the status changes', async () => {
    // Given the summary of a pending order
    renderPanel()

    // When the admin starts preparing it
    await userEvent.click(screen.getByRole('button', { name: 'Passa a En preparació' }))

    // Then the summary shows the new order and the calendar asks again
    expect(replaceOrder).toHaveBeenCalledWith({ ...order, status: 'preparing' })
    expect(onStatusChange).toHaveBeenCalledOnce()
  })

  it('closes with the button and with Escape', async () => {
    // Given the summary of an order
    renderPanel()

    // When the admin presses Escape and then clicks the button
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Tanca' }))

    // Then the summary is closed twice
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('lets the admin try again when the order cannot be loaded', async () => {
    // Given an order that could not be loaded
    vi.mocked(useAdminOrder).mockReturnValue({ status: 'error', retry, replaceOrder })
    renderPanel()

    // When the admin tries again
    await userEvent.click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the order is asked again
    expect(screen.getByRole('alert')).toHaveTextContent("No s'ha pogut carregar la comanda.")
    expect(retry).toHaveBeenCalledOnce()
  })
})

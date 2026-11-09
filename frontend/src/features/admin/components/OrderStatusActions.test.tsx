import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useChangeOrderStatus } from '../hooks/useChangeOrderStatus'
import type { AdminOrderDetail } from '../types/order'
import OrderStatusActions from './OrderStatusActions'

vi.mock('../hooks/useChangeOrderStatus', () => ({ useChangeOrderStatus: vi.fn() }))

const changeStatus = vi.fn()

const pendingOrder = {
  id: 7,
  status: 'pending',
  allowedStatuses: ['preparing', 'cancelled'],
} as AdminOrderDetail

const renderActions = (order: AdminOrderDetail) =>
  render(<OrderStatusActions order={order} onChange={vi.fn()} onConflict={vi.fn()} />)

describe('OrderStatusActions', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useChangeOrderStatus).mockReturnValue({
      pendingStatus: null,
      error: null,
      notice: null,
      changeStatus,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('only shows the statuses the order can go to', async () => {
    // Given a pending order
    renderActions(pendingOrder)

    // When the admin starts preparing it
    await userEvent.click(screen.getByRole('button', { name: 'Passa a En preparació' }))

    // Then only the allowed actions are shown and the new status is sent
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Cancel·la la comanda' })).toBeInTheDocument()
    expect(changeStatus).toHaveBeenCalledWith('preparing')
  })

  it('does not cancel the order when the admin says no', async () => {
    // Given a pending order and an admin that does not confirm
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderActions(pendingOrder)

    // When the admin clicks cancel
    await userEvent.click(screen.getByRole('button', { name: 'Cancel·la la comanda' }))

    // Then nothing is sent
    expect(window.confirm).toHaveBeenCalled()
    expect(changeStatus).not.toHaveBeenCalled()
  })

  it('shows no actions for a delivered order', () => {
    // Given a delivered order
    renderActions({ ...pendingOrder, status: 'delivered', allowedStatuses: [] })

    // Then there is nothing to change
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

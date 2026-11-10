import { act, renderHook } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { changeAdminOrderStatus, OrderStatusConflictError } from '../services/adminOrdersApi'
import type { AdminOrderDetail } from '../types/order'
import { useChangeOrderStatus } from './useChangeOrderStatus'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminOrdersApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/adminOrdersApi')>()),
  changeAdminOrderStatus: vi.fn(),
}))

const user = { getIdToken: vi.fn() } as unknown as User

describe('useChangeOrderStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('sends the new status and gives back the changed order', async () => {
    // Given a backend that changes the status
    const changedOrder = { id: 7, status: 'preparing' } as AdminOrderDetail
    vi.mocked(changeAdminOrderStatus).mockResolvedValue(changedOrder)
    const onChange = vi.fn()
    const { result } = renderHook(() => useChangeOrderStatus(7, { onChange, onConflict: vi.fn() }))

    // When the admin starts preparing the order
    await act(() => result.current.changeStatus('preparing'))

    // Then the changed order is given back and a message is shown
    expect(changeAdminOrderStatus).toHaveBeenCalledWith('token-123', 7, 'preparing')
    expect(onChange).toHaveBeenCalledWith(changedOrder)
    expect(result.current.notice).toBe('Estat canviat a En preparació.')
  })

  it('asks for the order again when someone else changed it', async () => {
    // Given a backend that answers with a conflict
    vi.mocked(changeAdminOrderStatus).mockRejectedValue(new OrderStatusConflictError())
    const onConflict = vi.fn()
    const { result } = renderHook(() => useChangeOrderStatus(7, { onChange: vi.fn(), onConflict }))

    // When the admin changes the status
    await act(() => result.current.changeStatus('ready'))

    // Then the error is shown and the order is asked again
    expect(result.current.error).toContain('Una altra persona ha canviat aquesta comanda')
    expect(onConflict).toHaveBeenCalledOnce()
  })
})

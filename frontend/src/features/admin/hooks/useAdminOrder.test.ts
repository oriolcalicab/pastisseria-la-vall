import { renderHook, waitFor, act } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminOrder } from '../services/adminOrdersApi'
import type { AdminOrderDetail } from '../types/order'
import { useAdminOrder } from './useAdminOrder'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminOrdersApi', () => ({ fetchAdminOrder: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const order = { id: 7, orderNumber: 'LV-261106-4F2A9C' } as AdminOrderDetail

describe('useAdminOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the order with the token of the admin', async () => {
    // Given a backend with the order
    vi.mocked(fetchAdminOrder).mockResolvedValue(order)

    // When the hook asks for it
    const { result } = renderHook(() => useAdminOrder('7'))

    // Then it is loading first and then it has the order
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ order })
    expect(fetchAdminOrder).toHaveBeenCalledWith('token-123', '7')
  })

  it('tells when the order does not exist', async () => {
    // Given a backend without the order
    vi.mocked(fetchAdminOrder).mockResolvedValue(null)

    // When the hook asks for it
    const { result } = renderHook(() => useAdminOrder('999'))

    // Then the status is not found
    await waitFor(() => expect(result.current.status).toBe('not-found'))
  })

  it('shows the order that comes back after a change', async () => {
    // Given a loaded pending order
    vi.mocked(fetchAdminOrder).mockResolvedValue(order)
    const { result } = renderHook(() => useAdminOrder('7'))
    await waitFor(() => expect(result.current.status).toBe('success'))

    // When the order is replaced by the one with the new status
    const preparingOrder = { ...order, status: 'preparing' } as AdminOrderDetail
    act(() => result.current.replaceOrder(preparingOrder))

    // Then the new order is shown without asking the backend again
    expect(result.current).toMatchObject({ status: 'success', order: preparingOrder })
    expect(fetchAdminOrder).toHaveBeenCalledOnce()
  })
})

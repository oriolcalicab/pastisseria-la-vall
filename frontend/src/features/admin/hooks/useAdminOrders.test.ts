import { renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminOrders } from '../services/adminOrdersApi'
import type { AdminOrderPage } from '../types/order'
import { useAdminOrders } from './useAdminOrders'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminOrdersApi', () => ({ fetchAdminOrders: vi.fn() }))

const orderPage: AdminOrderPage = { items: [], page: 2, pageSize: 20, total: 21, totalPages: 2 }

describe('useAdminOrders', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the requested page and status', async () => {
    // Given a backend that returns a page of orders
    vi.mocked(fetchAdminOrders).mockResolvedValue(orderPage)

    // When the hook asks for the second page of the ready orders
    const { result } = renderHook(() => useAdminOrders({ page: 2, status: 'ready' }))

    // Then it is loading first and then it has the data
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ data: orderPage })
    expect(fetchAdminOrders).toHaveBeenCalledWith('token-123', { page: 2, status: 'ready' })
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchAdminOrders).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the orders
    const { result } = renderHook(() => useAdminOrders({ page: 1, status: '' }))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
})

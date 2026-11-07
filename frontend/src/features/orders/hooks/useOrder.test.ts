import { renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchOrder } from '../services/ordersApi'
import type { OrderDetail } from '../types/order'
import { useOrder } from './useOrder'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/ordersApi', () => ({ fetchOrder: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const order = { id: 1, orderNumber: 'LV-261106-4F2A9C' } as OrderDetail

describe('useOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the order with the token of the customer', async () => {
    // Given a backend with the order
    vi.mocked(fetchOrder).mockResolvedValue(order)

    // When the hook asks for it
    const { result } = renderHook(() => useOrder('1'))

    // Then it is loading first and then it has the order
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ order })
    expect(fetchOrder).toHaveBeenCalledWith('token-123', '1')
  })

  it('tells when the order is not found', async () => {
    // Given a backend without the order
    vi.mocked(fetchOrder).mockResolvedValue(null)

    // When the hook asks for it
    const { result } = renderHook(() => useOrder('1'))

    // Then the status is not found
    await waitFor(() => expect(result.current.status).toBe('not-found'))
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchOrder).mockRejectedValue(new Error('Request failed'))

    // When the hook asks for the order
    const { result } = renderHook(() => useOrder('1'))

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
})

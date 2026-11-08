import { act, renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchOrders } from '../services/ordersApi'
import type { OrderSummary } from '../types/order'
import { useOrders } from './useOrders'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/ordersApi', () => ({ fetchOrders: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const orders = [{ id: 1, orderNumber: 'LV-261106-4F2A9C' }] as OrderSummary[]

describe('useOrders', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the orders with the token of the customer', async () => {
    // Given a backend with orders
    vi.mocked(fetchOrders).mockResolvedValue(orders)

    // When the hook asks for them
    const { result } = renderHook(() => useOrders())

    // Then it is loading first and then it has the orders
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ orders })
    expect(fetchOrders).toHaveBeenCalledWith('token-123')
  })

  it('asks again when retry is called', async () => {
    // Given a backend that fails once and then answers
    vi.mocked(fetchOrders)
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(orders)
    const { result } = renderHook(() => useOrders())
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the customer retries
    act(() => result.current.retry())

    // Then the orders are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchOrders).toHaveBeenCalledTimes(2)
  })
})

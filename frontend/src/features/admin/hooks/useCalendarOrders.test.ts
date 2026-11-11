import { renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchCalendarOrders } from '../services/adminOrdersApi'
import type { CalendarOrder } from '../types/calendar'
import { useCalendarOrders } from './useCalendarOrders'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminOrdersApi', () => ({ fetchCalendarOrders: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const orders = [{ id: 7, orderNumber: 'LV-261106-4F2A9C' }] as CalendarOrder[]

describe('useCalendarOrders', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('waits until the calendar says which days it shows', () => {
    // Given a calendar that has not told its range yet
    // When the hook is used
    const { result } = renderHook(() => useCalendarOrders(null))

    // Then it is loading and nothing is requested
    expect(result.current.status).toBe('loading')
    expect(fetchCalendarOrders).not.toHaveBeenCalled()
  })

  it('loads the orders of the range', async () => {
    // Given a backend with orders
    vi.mocked(fetchCalendarOrders).mockResolvedValue(orders)

    // When the hook asks for November
    const { result } = renderHook(() => useCalendarOrders({ from: '2026-11-01', to: '2026-11-30' }))

    // Then it has the orders of the range
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ orders })
    expect(fetchCalendarOrders).toHaveBeenCalledOnce()
  })
})

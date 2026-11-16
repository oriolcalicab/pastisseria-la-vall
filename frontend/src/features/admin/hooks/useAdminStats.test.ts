import { act, renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchAdminStats } from '../services/adminStatsApi'
import type { AdminStats } from '../types/stats'
import { useAdminStats } from './useAdminStats'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminStatsApi', () => ({ fetchAdminStats: vi.fn() }))

const user = { getIdToken: vi.fn() } as unknown as User
const range = { from: '2026-10-14', to: '2026-11-12' }
const stats = { ...range, revenueCents: 7500 } as AdminStats

describe('useAdminStats', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(user.getIdToken).mockResolvedValue('token-123')
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('loads the stats of the range with the token of the admin', async () => {
    // Given a backend with stats
    vi.mocked(fetchAdminStats).mockResolvedValue(stats)

    // When the hook asks for the last 30 days
    const { result } = renderHook(() => useAdminStats(range))

    // Then it starts loading and ends with the stats
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current).toMatchObject({ stats })
    expect(fetchAdminStats).toHaveBeenCalledWith('token-123', range)
  })

  it('shows the error and tries again on retry', async () => {
    // Given a backend that fails once
    vi.mocked(fetchAdminStats).mockRejectedValueOnce(new Error('down')).mockResolvedValue(stats)
    const { result } = renderHook(() => useAdminStats(range))
    await waitFor(() => expect(result.current.status).toBe('error'))

    // When the admin tries again
    act(() => result.current.retry())

    // Then the stats are loaded
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchAdminStats).toHaveBeenCalledTimes(2)
  })
})

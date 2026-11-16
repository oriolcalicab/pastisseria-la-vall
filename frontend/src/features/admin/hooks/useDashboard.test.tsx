import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardProvider } from '../context/DashboardProvider'
import { useAdminStats } from './useAdminStats'
import { useDashboard } from './useDashboard'

vi.mock('./useAdminStats', () => ({ useAdminStats: vi.fn() }))

const renderDashboard = () => renderHook(() => useDashboard(), { wrapper: DashboardProvider })

describe('useDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 12, 10))
    vi.mocked(useAdminStats).mockReturnValue({ status: 'loading', retry: vi.fn() })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('starts with the last 30 days', () => {
    // Given the dashboard
    // When it opens
    const { result } = renderDashboard()

    // Then the last 30 days are asked
    expect(result.current.preset).toBe('last30')
    expect(result.current.range).toEqual({ from: '2026-10-14', to: '2026-11-12' })
    expect(useAdminStats).toHaveBeenLastCalledWith({ from: '2026-10-14', to: '2026-11-12' })
  })

  it('shares the new range when the admin picks another period', () => {
    // Given the dashboard
    const { result } = renderDashboard()

    // When the admin picks this month
    act(() => result.current.selectPreset('thisMonth'))

    // Then every block gets the new range
    expect(result.current.preset).toBe('thisMonth')
    expect(useAdminStats).toHaveBeenLastCalledWith({ from: '2026-11-01', to: '2026-11-12' })
  })

  it('keeps the dates the admin writes', () => {
    // Given the dashboard
    const { result } = renderDashboard()

    // When the admin writes their own dates
    act(() => result.current.applyCustomRange({ from: '2026-09-01', to: '2026-09-30' }))

    // Then the period is custom
    expect(result.current.preset).toBe('custom')
    expect(result.current.range).toEqual({ from: '2026-09-01', to: '2026-09-30' })
  })

  it('fails outside the provider', () => {
    // Given no provider
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // When a block uses the dashboard
    // Then it explains what is missing
    expect(() => renderHook(() => useDashboard())).toThrow(
      'useDashboard must be used inside DashboardProvider',
    )
  })
})

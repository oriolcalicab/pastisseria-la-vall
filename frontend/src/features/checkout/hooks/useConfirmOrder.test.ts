import { act, renderHook } from '@testing-library/react'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { createOrder, OrderRequestError } from '../services/checkoutApi'
import { useConfirmOrder } from './useConfirmOrder'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/checkoutApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/checkoutApi')>()),
  createOrder: vi.fn(),
}))

const payload = {
  idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
  deliveryDate: '2026-11-12',
  deliveryMethod: 'pickup' as const,
  pickupPointId: 2,
  lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
}

const order = { id: 1, orderNumber: 'LV-261106-4F2A9C', status: 'pending', totalCents: 7800 }

describe('useConfirmOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('sends the order with the token of the user', async () => {
    // Given a backend that creates the order
    vi.mocked(createOrder).mockResolvedValue(order)
    const { result } = renderHook(() => useConfirmOrder())

    // When the order is confirmed
    await act(() => result.current.confirm(payload))

    // Then it is sent with the token and the order is kept
    expect(createOrder).toHaveBeenCalledWith('token-123', payload)
    expect(result.current).toMatchObject({ status: 'done', order })
  })

  it('only sends the order once when it is confirmed twice at the same time', async () => {
    // Given a backend that takes a while
    vi.mocked(createOrder).mockResolvedValue(order)
    const { result } = renderHook(() => useConfirmOrder())

    // When the customer clicks twice before the answer
    await act(() => Promise.all([result.current.confirm(payload), result.current.confirm(payload)]))

    // Then only one request is sent
    expect(createOrder).toHaveBeenCalledOnce()
  })

  it('keeps the error and lets the customer try again', async () => {
    // Given a backend that rejects the order once
    const warnings = [{ variantId: 12, type: 'price_changed' as const }]
    vi.mocked(createOrder)
      .mockRejectedValueOnce(new OrderRequestError('Alguns productes han canviat', warnings))
      .mockResolvedValueOnce(order)
    const { result } = renderHook(() => useConfirmOrder())

    // When the order is confirmed and fails
    await act(() => result.current.confirm(payload))

    // Then the error is kept
    expect(result.current.status).toBe('error')
    expect(result.current.error).toMatchObject({ message: 'Alguns productes han canviat', warnings })

    // When the customer tries again
    await act(() => result.current.confirm(payload))

    // Then the order is created with the same key
    expect(createOrder).toHaveBeenCalledTimes(2)
    expect(result.current.status).toBe('done')
  })
})

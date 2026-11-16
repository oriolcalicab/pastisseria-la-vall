import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCart } from '../../cart/hooks/useCart'
import { logout } from '../services/sessionService'
import LogoutButton from './LogoutButton'

vi.mock('../services/sessionService', () => ({ logout: vi.fn() }))
vi.mock('../../cart/hooks/useCart', () => ({ useCart: vi.fn() }))

const clear = vi.fn()

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useCart).mockReturnValue({ clear } as unknown as ReturnType<typeof useCart>)
    vi.mocked(logout).mockResolvedValue()
  })

  it('empties the cart and signs out', async () => {
    // Given a signed-in customer with products in the cart
    render(<LogoutButton />)

    // When the customer signs out
    await userEvent.click(screen.getByRole('button', { name: 'Tanca la sessió' }))

    // Then the cart is emptied and the session is closed
    expect(clear).toHaveBeenCalledOnce()
    expect(logout).toHaveBeenCalledOnce()
  })
})

import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from './CartProvider'
import { useCart } from './hooks/useCart'
import { loadCart } from './services/cartStorage'
import type { NewCartLine } from './types/cart'

const cake: NewCartLine = {
  variantId: 12,
  productId: 7,
  productName: 'Pastís de xocolata',
  variantName: '6 racions',
  priceCents: 3900,
  imageUrl: null,
}

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

const renderCart = () => renderHook(() => useCart(), { wrapper })

describe('CartProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts empty', () => {
    // Given nothing was saved
    // When the cart is used
    const { result } = renderCart()

    // Then it is empty
    expect(result.current).toMatchObject({ lines: [], itemCount: 0, totalCents: 0 })
  })

  it('keeps the cart after reloading the page', () => {
    // Given a cart with a product
    const firstVisit = renderCart()
    act(() => firstVisit.result.current.addItem(cake, 2))
    firstVisit.unmount()

    // When the page is loaded again
    const { result } = renderCart()

    // Then the product is still in the cart
    expect(result.current).toMatchObject({ itemCount: 2, totalCents: 7800 })
    expect(result.current.lines).toEqual([{ ...cake, quantity: 2 }])
  })

  it('changes the quantity of a line', () => {
    // Given a cart with a product
    const { result } = renderCart()
    act(() => result.current.addItem(cake))

    // When the quantity changes
    act(() => result.current.setQuantity(12, 3))

    // Then the totals change and it is saved
    expect(result.current).toMatchObject({ itemCount: 3, totalCents: 11700 })
    expect(loadCart()[0]?.quantity).toBe(3)
  })

  it('removes a line', () => {
    // Given a cart with a product
    const { result } = renderCart()
    act(() => result.current.addItem(cake))

    // When the product is removed
    act(() => result.current.removeItem(12))

    // Then the cart is empty
    expect(result.current.lines).toEqual([])
    expect(loadCart()).toEqual([])
  })

  it('clears the cart', () => {
    // Given a cart with a product
    const { result } = renderCart()
    act(() => result.current.addItem(cake))

    // When the cart is cleared
    act(() => result.current.clear())

    // Then it is empty
    expect(result.current.lines).toEqual([])
    expect(loadCart()).toEqual([])
  })

  it('fails when useCart is used outside the provider', () => {
    // Given no provider
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    // When the hook is used
    // Then it throws a clear error
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used inside CartProvider')
  })
})
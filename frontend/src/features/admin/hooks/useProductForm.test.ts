import { act, renderHook, waitFor } from '@testing-library/react'
import type { User } from 'firebase/auth'
import type { FormEvent } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../../auth/hooks/useAuth'
import { createAdminProduct } from '../services/adminProductsApi'
import { useProductForm } from './useProductForm'

vi.mock('../../auth/hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../services/adminProductsApi', () => ({ createAdminProduct: vi.fn() }))

const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>

type FormHook = { current: ReturnType<typeof useProductForm> }

const fillValidForm = (result: FormHook) => {
  act(() => {
    result.current.setField('categoryId', '1')
    result.current.setField('name', 'Pastís de maduixa')
    result.current.setField('description', 'Bescuit amb nata i maduixes')
  })
  const key = result.current.values.variants[0].key
  act(() => {
    result.current.setVariantField(key, 'name', '6 racions')
    result.current.setVariantField(key, 'price', '39,50')
    result.current.setVariantField(key, 'stock', '5')
  })
}

describe('useProductForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const user = { getIdToken: vi.fn().mockResolvedValue('token-123') } as unknown as User
    vi.mocked(useAuth).mockReturnValue({ user, isLoading: false })
  })

  it('starts with one empty variant and an active product', () => {
    // Given a new form
    // When the hook is used
    const { result } = renderHook(() => useProductForm(vi.fn()))

    // Then there is one empty variant and the product is active
    expect(result.current.values.variants).toEqual([{ key: 1, name: '', price: '', stock: '' }])
    expect(result.current.values.isActive).toBe(true)
  })

  it('adds variants and never removes the last one', () => {
    // Given a form with one variant
    const { result } = renderHook(() => useProductForm(vi.fn()))

    // When a variant is added and then both are removed
    act(() => result.current.addVariant())
    const [first, second] = result.current.values.variants
    act(() => result.current.removeVariant(first.key))
    act(() => result.current.removeVariant(second.key))

    // Then the second variant stays because it is the last one
    expect(result.current.values.variants.map((variant) => variant.key)).toEqual([second.key])
  })

  it('shows the errors and does not send an invalid form', async () => {
    // Given an empty form
    const { result } = renderHook(() => useProductForm(vi.fn()))

    // When it is submitted
    await act(() => result.current.handleSubmit(submitEvent()))

    // Then the errors are shown and nothing is sent
    expect(result.current.errors).toMatchObject({ categoryId: 'Tria una categoria' })
    expect(createAdminProduct).not.toHaveBeenCalled()
  })

  it('sends the product in cents and calls onSuccess', async () => {
    // Given a valid form
    const created = { id: 10 }
    vi.mocked(createAdminProduct).mockResolvedValue(created as never)
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useProductForm(onSuccess))
    fillValidForm(result)

    // When it is submitted
    await act(() => result.current.handleSubmit(submitEvent()))

    // Then the product is sent with the price in cents and onSuccess receives the created product
    expect(createAdminProduct).toHaveBeenCalledWith(
      'token-123',
      expect.objectContaining({
        categoryId: 1,
        variants: [{ name: '6 racions', priceCents: 3950, stock: 5 }],
      }),
    )
    expect(onSuccess).toHaveBeenCalledWith(created)
  })

  it('shows the message of the backend when it fails', async () => {
    // Given a backend that rejects the product
    vi.mocked(createAdminProduct).mockRejectedValue(new Error('La categoria no existeix'))
    const { result } = renderHook(() => useProductForm(vi.fn()))
    fillValidForm(result)

    // When it is submitted
    await act(() => result.current.handleSubmit(submitEvent()))

    // Then the message is shown and the form can be sent again
    await waitFor(() => expect(result.current.submitError).toBe('La categoria no existeix'))
    expect(result.current.isSubmitting).toBe(false)
  })
})
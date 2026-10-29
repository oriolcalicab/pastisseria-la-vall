import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from '../services/categoriesApi'
import { useCategories } from './useCategories'

vi.mock('../services/categoriesApi', () => ({ fetchCategories: vi.fn() }))

describe('useCategories', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads the categories', async () => {
    // Given a backend with two categories
    const categories = [
      { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
      { id: 1, name: 'Pastissos', slug: 'pastissos' },
    ]
    vi.mocked(fetchCategories).mockResolvedValue(categories)

    // When the hook is used
    const { result } = renderHook(() => useCategories())

    // Then it is loading first and then it has the categories
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current).toEqual({ status: 'success', categories }))
  })

  it('returns an error when the request fails', async () => {
    // Given a backend that fails
    vi.mocked(fetchCategories).mockRejectedValue(new Error('Request failed'))

    // When the hook is used
    const { result } = renderHook(() => useCategories())

    // Then the status is error
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
})
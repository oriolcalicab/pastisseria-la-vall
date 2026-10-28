import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCategories } from './categoriesApi'

describe('fetchCategories', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the categories', async () => {
    // Given a backend that returns two categories
    const categories = [
      { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
      { id: 1, name: 'Pastissos', slug: 'pastissos' },
    ]
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => categories })
    vi.stubGlobal('fetch', fetchMock)

    // When the categories are requested
    const result = await fetchCategories()

    // Then the public endpoint is called and the categories are returned
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/categories'))
    expect(result).toEqual(categories)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the categories are requested
    // Then the call fails
    await expect(fetchCategories()).rejects.toThrow()
  })
})
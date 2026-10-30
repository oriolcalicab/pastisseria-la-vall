import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchProducts } from './productsApi'

describe('fetchProducts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the page without a token', async () => {
    // Given a backend that returns a page of products
    const productPage = { items: [], page: 2, pageSize: 12, total: 0, totalPages: 0 }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => productPage })
    vi.stubGlobal('fetch', fetchMock)

    // When the second page is requested
    const result = await fetchProducts(2)

    // Then the public endpoint is called with the page and the page is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/products?page=2&pageSize=12'),
    )
    expect(result).toEqual(productPage)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the products are requested
    // Then the call fails
    await expect(fetchProducts(1)).rejects.toThrow()
  })
})
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchProducts, fetchProduct } from './productsApi'

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
    const result = await fetchProducts(2, '')

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
    await expect(fetchProducts(1, '')).rejects.toThrow()
  })

  it('sends the diets when there are any', async () => {
    // Given a backend that answers correctly
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    // When the products are requested with two diets
    await fetchProducts(1, 'vegan,gluten_free')

    // Then the URL has the diets
    expect(fetchMock.mock.calls[0]?.[0]).toContain('diet=vegan%2Cgluten_free')
  })
})

describe('fetchProduct', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the product', async () => {
    // Given a backend with the product
    const product = { id: 7, name: 'Pastís de xocolata' }
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => product })
    vi.stubGlobal('fetch', fetchMock)

    // When the product is requested
    const result = await fetchProduct('7')

    // Then the product is returned
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/products\/7$/))
    expect(result).toEqual(product)
  })

  it('encodes the id of the URL', async () => {
    // Given a text in the address instead of an id
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 400 })
    vi.stubGlobal('fetch', fetchMock)

    // When the product is requested
    await fetchProduct('../admin')

    // Then the text can not change the path of the request
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/products/..%2Fadmin'))
  })

  it.each([400, 404])('returns null when the backend answers %i', async (status) => {
    // Given a backend that does not find the product
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status }))

    // When the product is requested
    // Then there is no product
    await expect(fetchProduct('9999')).resolves.toBeNull()
  })

  it('throws when the backend fails', async () => {
    // Given a backend that fails
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    // When the product is requested
    // Then the call fails
    await expect(fetchProduct('7')).rejects.toThrow()
  })
})

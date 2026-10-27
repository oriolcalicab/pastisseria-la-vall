import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAdminProducts } from './adminProductsApi'

describe('fetchAdminProducts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the token, the page and the search', async () => {
    // Given a backend that returns a page of products
    const productPage = { items: [], page: 2, pageSize: 20, total: 0, totalPages: 0 }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => productPage })
    vi.stubGlobal('fetch', fetchMock)

    // When the second page is requested searching "croi"
    const result = await fetchAdminProducts('token-123', { page: 2, search: ' croi ' })

    // Then the request carries the token and the query, and the page is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/products?page=2&search=croi'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )
    expect(result).toEqual(productPage)
  })

  it('does not send the search when it is empty', async () => {
    // Given a backend that answers correctly
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    // When the first page is requested without search
    await fetchAdminProducts('token-123', { page: 1, search: '   ' })

    // Then the URL only has the page
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/admin\/products\?page=1$/)
  })

  it('throws when the backend answers with an error', async () => {
    // Given a backend that rejects the request
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))

    // When the products are requested
    // Then the call fails
    await expect(fetchAdminProducts('token-123', { page: 1, search: '' })).rejects.toThrow()
  })
})
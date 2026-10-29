import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createAdminProduct,
  fetchAdminProducts,
  setAdminProductActive,
  setAdminVariantActive,
} from './adminProductsApi'
import type { NewProduct } from '../types/product'

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

describe('createAdminProduct', () => {
  const newProduct: NewProduct = {
    categoryId: 1,
    name: 'Pastís de maduixa',
    description: 'Bescuit amb nata i maduixes',
    allergens: '',
    isGlutenFree: false,
    isPlantMilk: false,
    isVegan: false,
    isActive: true,
    variants: [{ name: '6 racions', priceCents: 3900, stock: 5 }],
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the product with the token and returns the created product', async () => {
    // Given a backend that creates the product
    const created = { id: 10, name: 'Pastís de maduixa' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => created })
    vi.stubGlobal('fetch', fetchMock)

    // When the product is created
    const result = await createAdminProduct('token-123', newProduct)

    // Then the product is sent as JSON with the token and the created product is returned
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/products'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
        body: JSON.stringify(newProduct),
      }),
    )
    expect(result).toEqual(created)
  })

  it('throws the message sent by the backend', async () => {
    // Given a backend that rejects the category
    const json = async () => ({ error: 'La categoria no existeix' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400, json }))

    // When the product is created
    // Then the error has the backend message
    await expect(createAdminProduct('token-123', newProduct)).rejects.toThrow(
      'La categoria no existeix',
    )
  })

  it('throws a generic message when the answer is not JSON', async () => {
    // Given a backend that answers with something that is not JSON
    const json = async () => {
      throw new SyntaxError('Unexpected token')
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json }))

    // When the product is created
    // Then the error has the generic message
    await expect(createAdminProduct('token-123', newProduct)).rejects.toThrow(
      "No s'ha pogut crear el producte",
    )
  })
})

describe('setAdminProductActive', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends PATCH with isActive to the product', async () => {
    // Given a backend that deactivates the product
    const updated = { id: 7, isActive: false }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => updated })
    vi.stubGlobal('fetch', fetchMock)

    // When the product is deactivated
    const result = await setAdminProductActive('token-123', 7, false)

    // Then the request goes to the product with the token and the new status
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/products\/7$/),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
        body: JSON.stringify({ isActive: false }),
      }),
    )
    expect(result).toEqual(updated)
  })

  it('throws the message sent by the backend', async () => {
    // Given a backend that does not find the product
    const json = async () => ({ error: 'El producte no existeix' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json }))

    // When the product is deactivated
    // Then the error has the backend message
    await expect(setAdminProductActive('token-123', 9999, false)).rejects.toThrow(
      'El producte no existeix',
    )
  })
})

describe('setAdminVariantActive', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends PATCH with isActive to the variant of the product', async () => {
    // Given a backend that activates the variant
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 12 }) })
    vi.stubGlobal('fetch', fetchMock)

    // When the variant is activated
    await setAdminVariantActive('token-123', 7, 12, true)

    // Then the request goes to the variant inside the product
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/products\/7\/variants\/12$/),
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ isActive: true }) }),
    )
  })

  it('throws a generic message when the answer is not JSON', async () => {
    // Given a backend that answers with something that is not JSON
    const json = async () => {
      throw new SyntaxError('Unexpected token')
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json }))

    // When the variant is changed
    // Then the error has the generic message
    await expect(setAdminVariantActive('token-123', 7, 12, false)).rejects.toThrow(
      "No s'ha pogut canviar l'estat",
    )
  })
})
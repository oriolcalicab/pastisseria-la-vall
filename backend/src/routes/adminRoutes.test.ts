import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import adminRouter from './adminRoutes.js'
import {
  createProduct,
  listProducts,
  setProductActive,
  setVariantActive,
} from '../services/productService.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/productService.js', () => ({
  listProducts: vi.fn(),
  createProduct: vi.fn(),
  setProductActive: vi.fn(),
  setVariantActive: vi.fn(),
})) 

let server: TestServer

const loginAs = (role: 'customer' | 'admin') => {
  vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
  vi.mocked(findUserByFirebaseUid).mockResolvedValue({ id: 1, role } as never)
}

const getPing = (headers: Record<string, string> = {}, query = '') =>
  fetch(`${server.baseUrl}/api/admin/ping${query}`, { headers })

describe('GET /api/admin/ping', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/admin', adminRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('responds 401 to a visitor without token', async () => {
    // Given a visitor without token
    // When the visitor calls an admin endpoint
    const response = await getPing()

    // Then the request is rejected with 401
    expect(response.status).toBe(401)
  })

  it('responds 401 when the user is not registered', async () => {
    // Given a valid Firebase token without row in users
    vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
    vi.mocked(findUserByFirebaseUid).mockResolvedValue(null)

    // When the user calls an admin endpoint
    const response = await getPing({ Authorization: 'Bearer token' })

    // Then the request is rejected with 401
    expect(response.status).toBe(401)
  })

  it('responds 403 to a customer', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer calls an admin endpoint
    const response = await getPing({ Authorization: 'Bearer token' })

    // Then the request is rejected with 403
    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Accés denegat' })
  })

  it('responds 200 to an admin', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin calls an admin endpoint
    const response = await getPing({ Authorization: 'Bearer token' })

    // Then the request succeeds
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('ignores a role sent by the customer in the request', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer sends an admin role in a header and in the query
    const response = await getPing(
      { Authorization: 'Bearer token', 'X-Role': 'admin' },
      '?role=admin',
    )

    // Then the role comes from the database and the request is rejected with 403
    expect(response.status).toBe(403)
  })
})

const getProducts = (query = '') =>
  fetch(`${server.baseUrl}/api/admin/products${query}`, {
    headers: { Authorization: 'Bearer token' },
  })

describe('GET /api/admin/products', () => {
  const productPage = {
    items: [{ id: 1, name: 'Croissant' }],
    page: 1,
    pageSize: 20,
    total: 1,
    totalPages: 1,
  }

  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/admin', adminRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(listProducts).mockResolvedValue(productPage as never)
  })

  it('returns the first page with the default values', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin asks for the products without query
    const response = await getProducts()

    // Then the first page of 20 products is returned
    expect(response.status).toBe(200)
    expect(listProducts).toHaveBeenCalledWith({ page: 1, pageSize: 20, search: undefined })
    expect(await response.json()).toEqual(productPage)
  })

  it('passes the page, the page size and the search to the service', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin asks for the second page searching "croi"
    await getProducts('?page=2&pageSize=10&search=croi')

    // Then the service receives the parsed values
    expect(listProducts).toHaveBeenCalledWith({ page: 2, pageSize: 10, search: 'croi' })
  })

  it('responds 400 when the page is not valid', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin asks for page 0
    const response = await getProducts('?page=0')

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(listProducts).not.toHaveBeenCalled()
  })

  it('responds 403 to a customer', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer asks for the products
    const response = await getProducts()

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(403)
    expect(listProducts).not.toHaveBeenCalled()
  })

  it('responds 401 to a visitor without token', async () => {
    // Given a visitor without token
    // When the visitor asks for the products
    const response = await fetch(`${server.baseUrl}/api/admin/products`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(401)
    expect(listProducts).not.toHaveBeenCalled()
  })
})

const validProduct = {
  categoryId: 1,
  name: '  Pastís de maduixa  ',
  description: 'Bescuit amb nata i maduixes',
  variants: [{ name: '6 racions', priceCents: 3900, stock: 5 }],
}

const postProduct = (
  body: object,
  headers: Record<string, string> = { Authorization: 'Bearer token' },
) =>
  fetch(`${server.baseUrl}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

describe('POST /api/admin/products', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/admin', adminRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('creates the product and responds 201', async () => {
    // Given a logged admin and an existing category
    loginAs('admin')
    vi.mocked(createProduct).mockResolvedValue({ id: 10, name: 'Pastís de maduixa' } as never)

    // When the admin sends a valid product
    const response = await postProduct(validProduct)

    // Then the clean product is created and returned
    expect(response.status).toBe(201)
    expect(createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Pastís de maduixa',
        variants: [{ name: '6 racions', priceCents: 3900, stock: 5, sortOrder: 0 }],
      }),
    )
    expect(await response.json()).toEqual({ id: 10, name: 'Pastís de maduixa' })
  })

  it('responds 400 when the product has no variants', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin sends a product without variants
    const response = await postProduct({ ...validProduct, variants: [] })

    // Then the request is rejected with the reason and nothing is created
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'El producte ha de tenir com a mínim una variant',
    })
    expect(createProduct).not.toHaveBeenCalled()
  })

  it.each([
    ['a negative price', { priceCents: -100 }, 'El preu de la variant 1'],
    ['a negative stock', { stock: -1 }, "L'stock de la variant 1"],
  ])('responds 400 when a variant has %s', async (_case, overrides, message) => {
    // Given a logged admin
    loginAs('admin')

    // When the admin sends a variant with an invalid value
    const variants = [{ ...validProduct.variants[0], ...overrides }]
    const response = await postProduct({ ...validProduct, variants })

    // Then the request is rejected with the reason and nothing is created
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: expect.stringContaining(message) })
    expect(createProduct).not.toHaveBeenCalled()
  })

  it('responds 400 when the category does not exist', async () => {
    // Given a logged admin and a category that does not exist
    loginAs('admin')
    vi.mocked(createProduct).mockResolvedValue(null)

    // When the admin sends the product
    const response = await postProduct({ ...validProduct, categoryId: 999 })

    // Then the request is rejected
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'La categoria no existeix' })
  })

  it('responds 403 to a customer', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer sends a product
    const response = await postProduct(validProduct)

    // Then the request is rejected and nothing is created
    expect(response.status).toBe(403)
    expect(createProduct).not.toHaveBeenCalled()
  })

  it('responds 401 to a visitor without token', async () => {
    // Given a visitor without token
    // When the visitor sends a product
    const response = await postProduct(validProduct, {})

    // Then the request is rejected and nothing is created
    expect(response.status).toBe(401)
    expect(createProduct).not.toHaveBeenCalled()
  })
})

const patch = (
  path: string,
  body: object,
  headers: Record<string, string> = { Authorization: 'Bearer token' },
) =>
  fetch(`${server.baseUrl}/api/admin${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

describe('PATCH active status', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/admin', adminRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('PATCH /api/admin/products/:id', () => {
    it('deactivates the product', async () => {
      // Given a logged admin and an existing product
      loginAs('admin')
      vi.mocked(setProductActive).mockResolvedValue({ id: 7, isActive: false } as never)

      // When the admin deactivates the product
      const response = await patch('/products/7', { isActive: false })

      // Then the product is deactivated and returned
      expect(response.status).toBe(200)
      expect(setProductActive).toHaveBeenCalledWith(7, false)
      expect(await response.json()).toEqual({ id: 7, isActive: false })
    })

    it('responds 400 when the id is not valid', async () => {
      // Given a logged admin
      loginAs('admin')

      // When the admin uses an id that is not a number
      const response = await patch('/products/abc', { isActive: false })

      // Then the request is rejected and nothing is changed
      expect(response.status).toBe(400)
      expect(setProductActive).not.toHaveBeenCalled()
    })

    it('responds 400 when isActive is not true or false', async () => {
      // Given a logged admin
      loginAs('admin')

      // When the admin sends isActive as text
      const response = await patch('/products/7', { isActive: 'false' })

      // Then the request is rejected and nothing is changed
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Cal enviar isActive amb true o false' })
      expect(setProductActive).not.toHaveBeenCalled()
    })

    it('responds 404 when the product does not exist', async () => {
      // Given a logged admin and a product that does not exist
      loginAs('admin')
      vi.mocked(setProductActive).mockResolvedValue(null)

      // When the admin deactivates it
      const response = await patch('/products/9999', { isActive: false })

      // Then the request is answered with 404
      expect(response.status).toBe(404)
    })

    it('responds 403 to a customer', async () => {
      // Given a logged customer
      loginAs('customer')

      // When the customer tries to deactivate a product
      const response = await patch('/products/7', { isActive: false })

      // Then the request is rejected and nothing is changed
      expect(response.status).toBe(403)
      expect(setProductActive).not.toHaveBeenCalled()
    })

    it('responds 401 to a visitor without token', async () => {
      // Given a visitor without token
      // When the visitor tries to deactivate a product
      const response = await patch('/products/7', { isActive: false }, {})

      // Then the request is rejected and nothing is changed
      expect(response.status).toBe(401)
      expect(setProductActive).not.toHaveBeenCalled()
    })
  })

  describe('PATCH /api/admin/products/:productId/variants/:variantId', () => {
    it('activates the variant of the product', async () => {
      // Given a logged admin and an existing variant
      loginAs('admin')
      vi.mocked(setVariantActive).mockResolvedValue({ id: 12, isActive: true } as never)

      // When the admin activates the variant
      const response = await patch('/products/7/variants/12', { isActive: true })

      // Then the variant of that product is activated and returned
      expect(response.status).toBe(200)
      expect(setVariantActive).toHaveBeenCalledWith(7, 12, true)
      expect(await response.json()).toEqual({ id: 12, isActive: true })
    })

    it('responds 404 when the variant is not of that product', async () => {
      // Given a logged admin and a variant of another product
      loginAs('admin')
      vi.mocked(setVariantActive).mockResolvedValue(null)

      // When the admin changes it through the wrong product
      const response = await patch('/products/7/variants/12', { isActive: false })

      // Then the request is answered with 404
      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'La variant no existeix en aquest producte' })
    })

    it('responds 400 when the variant id is not valid', async () => {
      // Given a logged admin
      loginAs('admin')

      // When the admin uses a variant id that is not valid
      const response = await patch('/products/7/variants/0', { isActive: false })

      // Then the request is rejected and nothing is changed
      expect(response.status).toBe(400)
      expect(setVariantActive).not.toHaveBeenCalled()
    })
  })
})
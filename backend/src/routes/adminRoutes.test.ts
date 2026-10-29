import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import adminRouter from './adminRoutes.js'
import { listProducts, createProduct } from '../services/productService.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/productService.js', () => ({ listProducts: vi.fn(), createProduct: vi.fn() }))
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

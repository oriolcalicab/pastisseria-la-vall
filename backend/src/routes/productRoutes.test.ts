import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { listPublicProducts, getPublicProduct } from '../services/productService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import productRouter from './productRoutes.js'

vi.mock('../services/productService.js', () => ({
  getPublicProduct: vi.fn(),
  listPublicProducts: vi.fn(),
}))
let server: TestServer

const productPage = { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }

describe('GET /api/products', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/products', productRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(listPublicProducts).mockResolvedValue(productPage)
  })

  it('lists the products without login', async () => {
    // Given a visitor without token
    // When the visitor asks for the products
    const response = await fetch(`${server.baseUrl}/api/products`)

    // Then the first page is returned
    expect(response.status).toBe(200)
    expect(listPublicProducts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      category: undefined,
      diets: [],
    })
    expect(await response.json()).toEqual(productPage)
  })

  it('passes the page and the category to the service', async () => {
    // Given a visitor
    // When the visitor asks for the second page of a category
    await fetch(`${server.baseUrl}/api/products?page=2&pageSize=12&category=pastissos`)

    // Then the service receives the parsed values
    expect(listPublicProducts).toHaveBeenCalledWith({
      page: 2,
      pageSize: 12,
      category: 'pastissos',
      diets: [],
    })
  })

  it('responds 400 when the category is not valid', async () => {
    // Given a visitor
    // When the visitor sends an invalid category
    const response = await fetch(`${server.baseUrl}/api/products?category=Pastissos`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(listPublicProducts).not.toHaveBeenCalled()
  })

  it('responds 400 when the page size is too big', async () => {
    // Given a visitor
    // When the visitor asks for too many products at once
    const response = await fetch(`${server.baseUrl}/api/products?pageSize=51`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(listPublicProducts).not.toHaveBeenCalled()
  })

  it('passes the diets to the service', async () => {
    // Given a visitor
    // When the visitor filters by two diets
    await fetch(`${server.baseUrl}/api/products?diet=vegan,plant_milk`)

    // Then the service receives both diets
    expect(listPublicProducts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      category: undefined,
      diets: ['vegan', 'plant_milk'],
    })
  })

  it('responds 400 when the diet is not valid', async () => {
    // Given a visitor
    // When the visitor sends an unknown diet
    const response = await fetch(`${server.baseUrl}/api/products?diet=keto`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(listPublicProducts).not.toHaveBeenCalled()
  })

    it('passes the diet, the category and the page together', async () => {
    // Given a visitor
    // When the visitor combines all the filters
    await fetch(`${server.baseUrl}/api/products?diet=vegan&category=cupcakes&page=2`)

    // Then the service receives all of them
    expect(listPublicProducts).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      category: 'cupcakes',
      diets: ['vegan'],
    })
  })

    it('returns one product without login', async () => {
    // Given an available product
    const product = { id: 7, name: 'Pastís de xocolata' }
    vi.mocked(getPublicProduct).mockResolvedValue(product as never)

    // When a visitor without token asks for it
    const response = await fetch(`${server.baseUrl}/api/products/7`)

    // Then the product is returned
    expect(response.status).toBe(200)
    expect(getPublicProduct).toHaveBeenCalledWith(7)
    expect(await response.json()).toEqual(product)
  })

  it('responds 404 when the product does not exist', async () => {
    // Given a product that is not available
    vi.mocked(getPublicProduct).mockResolvedValue(null)

    // When a visitor asks for it
    const response = await fetch(`${server.baseUrl}/api/products/9999`)

    // Then the request is answered with 404
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'El producte no existeix' })
  })

  it('responds 400 when the id is not valid', async () => {
    // Given a visitor
    // When the visitor uses an id that is not a number
    const response = await fetch(`${server.baseUrl}/api/products/abc`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(getPublicProduct).not.toHaveBeenCalled()
  })

    it('responds 400 when the id is too big for the database', async () => {
    // Given a visitor
    // When the visitor uses an id bigger than the database can store
    const response = await fetch(`${server.baseUrl}/api/products/2147483648`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(getPublicProduct).not.toHaveBeenCalled()
  })
})

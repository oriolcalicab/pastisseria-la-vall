import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { listPublicProducts } from '../services/productService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import productRouter from './productRoutes.js'

vi.mock('../services/productService.js', () => ({ listPublicProducts: vi.fn() }))

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
    expect(listPublicProducts).toHaveBeenCalledWith({ page: 1, pageSize: 20, category: undefined })
    expect(await response.json()).toEqual(productPage)
  })

  it('passes the page and the category to the service', async () => {
    // Given a visitor
    // When the visitor asks for the second page of a category
    await fetch(`${server.baseUrl}/api/products?page=2&pageSize=12&category=pastissos`)

    // Then the service receives the parsed values
    expect(listPublicProducts).toHaveBeenCalledWith({ page: 2, pageSize: 12, category: 'pastissos' })
  })

  it('responds 400 when the category is not valid', async () => {
    // Given a visitor
    // When the visitor sends an invalid category
    const response = await fetch(`${server.baseUrl}/api/products?category=Pastissos`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(listPublicProducts).not.toHaveBeenCalled()
  })
})
import express from 'express'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { listCategories } from '../services/categoryService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import categoryRouter from './categoryRoutes.js'

vi.mock('../services/categoryService.js', () => ({ listCategories: vi.fn() }))

let server: TestServer

describe('GET /api/categories', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/categories', categoryRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  it('lists the categories without login', async () => {
    // Given two categories
    const categories = [
      { id: 2, name: 'Cupcakes', slug: 'cupcakes' },
      { id: 1, name: 'Pastissos', slug: 'pastissos' },
    ]
    vi.mocked(listCategories).mockResolvedValue(categories)

    // When a visitor without token asks for the categories
    const response = await fetch(`${server.baseUrl}/api/categories`)

    // Then the categories are returned
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(categories)
  })
})
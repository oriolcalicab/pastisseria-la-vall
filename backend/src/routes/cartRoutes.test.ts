import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { validateCart } from '../services/cartService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import cartRouter from './cartRoutes.js'

vi.mock('../services/cartService.js', () => ({ validateCart: vi.fn() }))

let server: TestServer

const validate = (body: object) =>
  fetch(`${server.baseUrl}/api/cart/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/cart/validate', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/cart', cartRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('validates the cart without login', async () => {
    // Given a backend that answers with a validated cart
    const result = { lines: [], warnings: [{ variantId: 12, type: 'unavailable' }], totalCents: 0 }
    vi.mocked(validateCart).mockResolvedValue(result as never)
    const line = { variantId: 12, quantity: 1, priceCents: 3900 }

    // When a visitor without token validates the cart
    const response = await validate({ lines: [line] })

    // Then the validated cart is returned
    expect(response.status).toBe(200)
    expect(validateCart).toHaveBeenCalledWith([line])
    expect(await response.json()).toEqual(result)
  })

  it('responds 400 when the cart is not valid', async () => {
    // Given a visitor
    // When the visitor sends a wrong quantity
    const response = await validate({
      lines: [{ variantId: 12, quantity: 0, priceCents: 3900 }],
    })

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'El carretó no és vàlid' })
    expect(validateCart).not.toHaveBeenCalled()
  })
})
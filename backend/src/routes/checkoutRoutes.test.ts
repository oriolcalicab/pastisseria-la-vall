import express from 'express'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { getShippingFeeCents } from '../services/settingsService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import checkoutRouter from './checkoutRoutes.js'

vi.mock('../services/settingsService.js', () => ({ getShippingFeeCents: vi.fn() }))

let server: TestServer

describe('GET /api/checkout/shipping-fee', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/checkout', checkoutRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  it('returns the shipping fee without login', async () => {
    // Given a shipping fee of 500 cents
    vi.mocked(getShippingFeeCents).mockResolvedValue(500)

    // When a visitor without token asks for it
    const response = await fetch(`${server.baseUrl}/api/checkout/shipping-fee`)

    // Then the fee is returned
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ shippingFeeCents: 500 })
  })
})

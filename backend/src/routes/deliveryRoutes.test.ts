import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDeliveryDates } from '../services/deliveryService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import deliveryRouter from './deliveryRoutes.js'

vi.mock('../services/deliveryService.js', () => ({ getDeliveryDates: vi.fn() }))

let server: TestServer

describe('GET /api/delivery-dates', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/delivery-dates', deliveryRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getDeliveryDates).mockResolvedValue({ month: '2026-12', days: [] })
  })

  it('returns the days of the month without login', async () => {
    // Given a visitor without token
    // When the visitor asks for December
    const response = await fetch(`${server.baseUrl}/api/delivery-dates?month=2026-12`)

    // Then the days of December are returned
    expect(response.status).toBe(200)
    expect(getDeliveryDates).toHaveBeenCalledWith('2026-12', expect.any(Date))
    expect(await response.json()).toEqual({ month: '2026-12', days: [] })
  })

  it('uses the current month when there is none', async () => {
    // Given a visitor
    // When the visitor does not send a month
    await fetch(`${server.baseUrl}/api/delivery-dates`)

    // Then a month is requested
    expect(getDeliveryDates).toHaveBeenCalledWith(
      expect.stringMatching(/^\d{4}-\d{2}$/),
      expect.any(Date),
    )
  })

  it('responds 400 when the month is not valid', async () => {
    // Given a visitor
    // When the visitor sends an invalid month
    const response = await fetch(`${server.baseUrl}/api/delivery-dates?month=2026-13`)

    // Then the request is rejected and the database is not queried
    expect(response.status).toBe(400)
    expect(getDeliveryDates).not.toHaveBeenCalled()
  })
})

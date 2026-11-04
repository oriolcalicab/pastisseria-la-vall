import express from 'express'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { listPickupPoints } from '../services/pickupPointService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import pickupPointRouter from './pickupPointRoutes.js'

vi.mock('../services/pickupPointService.js', () => ({ listPickupPoints: vi.fn() }))

let server: TestServer

describe('GET /api/pickup-points', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/pickup-points', pickupPointRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  it('lists the pickup points without login', async () => {
    // Given an active pickup point
    const points = [
      {
        id: 2,
        name: 'La Vall · Eixample',
        address: 'Carrer de Girona, 84',
        city: 'Barcelona',
        latitude: 41.3965,
        longitude: 2.1675,
        openingHours: 'De dt. a ds., de 9 a 19 h',
      },
    ]
    vi.mocked(listPickupPoints).mockResolvedValue(points)

    // When a visitor without token asks for them
    const response = await fetch(`${server.baseUrl}/api/pickup-points`)

    // Then the pickup points are returned
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(points)
  })
})
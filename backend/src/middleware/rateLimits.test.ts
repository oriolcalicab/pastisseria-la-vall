import express from 'express'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import { createRateLimiter } from './rateLimits.js'

let server: TestServer

describe('createRateLimiter', () => {
  beforeAll(async () => {
    const app = express()
    app.post('/orders', createRateLimiter(2), (_req, res) => {
      res.status(201).json({ ok: true })
    })
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  it('answers 429 with the same error format after the limit', async () => {
    // Given a limit of two requests
    const send = () => fetch(`${server.baseUrl}/orders`, { method: 'POST' })

    // When the same client sends three
    const first = await send()
    const second = await send()
    const third = await send()

    // Then the third one is rejected with a clear error and the limit headers
    expect([first.status, second.status, third.status]).toEqual([201, 201, 429])
    expect(await third.json()).toEqual({
      error: "Massa peticions. Torna-ho a provar d'aquí a una estona.",
    })
    expect(third.headers.get('ratelimit-policy')).toContain('2')
  })
})

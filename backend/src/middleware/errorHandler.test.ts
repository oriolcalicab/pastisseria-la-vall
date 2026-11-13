import express from 'express'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import { errorHandler } from './errorHandler.js'

let server: TestServer

describe('errorHandler', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.get('/broken', async () => {
      throw new Error('Prisma: connection refused at db.internal:5432')
    })
    app.post('/echo', (req, res) => {
      res.json(req.body)
    })
    app.use(errorHandler)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  it('hides the details of an unexpected error', async () => {
    // Given a route that fails with an internal message
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    // When it is called
    const response = await fetch(`${server.baseUrl}/broken`)

    // Then the client gets a generic error and the details only go to the log
    expect(response.status).toBe(500)
    const body = await response.text()
    expect(JSON.parse(body)).toEqual({
      error: 'Hi ha hagut un error al servidor. Torna-ho a provar.',
    })
    expect(body).not.toContain('Prisma')
    expect(log).toHaveBeenCalledOnce()
    log.mockRestore()
  })

  it('answers 400 when the body is not valid JSON', async () => {
    // Given a body that is not JSON
    // When it is sent
    const response = await fetch(`${server.baseUrl}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ "name": ',
    })

    // Then the error says what is wrong with the same format
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'El cos de la petició no és un JSON vàlid' })
  })
})

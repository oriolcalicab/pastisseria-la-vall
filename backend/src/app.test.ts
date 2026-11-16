import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'
import { startTestServer } from './test/startTestServer.js'
import type { TestServer } from './test/startTestServer.js'

vi.mock('./lib/prisma.js', () => ({ prisma: {} }))
vi.mock('./config/firebaseAdmin.js', () => ({ firebaseAuth: {} }))

const FRONTEND = 'https://pastisseria-la-vall.vercel.app'

let server: TestServer

describe('app', () => {
  beforeAll(async () => {
    server = await startTestServer(createApp([FRONTEND]))
  })

  afterAll(() => {
    server.close()
  })

  it('answers the health check', async () => {
    // Given the backend
    // When Render checks it
    const response = await fetch(`${server.baseUrl}/health`)

    // Then it is ok
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('answers a route that does not exist with the same error format', async () => {
    // Given the backend
    // When an unknown route is called
    const response = await fetch(`${server.baseUrl}/api/does-not-exist`)

    // Then it is a 404 with a JSON error
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Aquesta ruta no existeix' })
  })

  it('lets the frontend read the answers', async () => {
    // Given the published frontend
    // When it calls the backend
    const response = await fetch(`${server.baseUrl}/health`, { headers: { Origin: FRONTEND } })

    // Then the browser is allowed to read the answer
    expect(response.headers.get('access-control-allow-origin')).toBe(FRONTEND)
  })

  it('does not let another website read the answers', async () => {
    // Given another website
    // When it calls the backend from a browser
    const response = await fetch(`${server.baseUrl}/health`, {
      headers: { Origin: 'https://evil.example' },
    })

    // Then the browser is not allowed to read the answer
    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })
})

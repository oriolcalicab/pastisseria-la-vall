import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import authRouter from './authRoutes.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../lib/prisma.js', () => ({
  prisma: { user: { findUnique: vi.fn(), create: vi.fn() } },
}))

let server: TestServer

const register = (body: object) =>
  fetch(`${server.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(body),
  })

describe('POST /api/auth/register role escalation', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/auth', authRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
  })

  it('creates a customer even when the body asks for admin', async () => {
    // Given a new user that is not in the database
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockImplementation((({ data }: { data: object }) =>
      Promise.resolve({ id: 1, ...data })) as never)

    // When the user registers sending role admin
    const response = await register({ name: 'Oriol', role: 'admin' })

    // Then the user is saved and returned as customer
    expect(response.status).toBe(201)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ role: 'customer' }),
    })
    expect(await response.json()).toMatchObject({ role: 'customer' })
  })

  it('keeps the existing role when a customer registers again asking for admin', async () => {
    // Given a customer that is already registered
    const customer = { id: 1, name: 'Oriol', email: 'a@b.com', role: 'customer' }
    vi.mocked(prisma.user.findUnique).mockResolvedValue(customer as never)

    // When the customer registers again sending role admin
    const response = await register({ name: 'Oriol', role: 'admin' })

    // Then nothing is created and the role is still customer
    expect(response.status).toBe(200)
    expect(prisma.user.create).not.toHaveBeenCalled()
    expect(await response.json()).toMatchObject({ role: 'customer' })
  })
})

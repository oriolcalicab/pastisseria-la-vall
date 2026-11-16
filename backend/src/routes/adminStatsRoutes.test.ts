import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAdminStats } from '../services/statsService.js'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import adminStatsRouter from './adminStatsRoutes.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/statsService.js', () => ({ getAdminStats: vi.fn() }))

let server: TestServer

const PERIOD = '?from=2026-10-14&to=2026-11-12'

const loginAs = (role: 'customer' | 'admin') => {
  vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
  vi.mocked(findUserByFirebaseUid).mockResolvedValue({ id: 1, role } as never)
}

const getStats = (search: string, withToken = true) =>
  fetch(`${server.baseUrl}/api/admin/stats${search}`, {
    headers: withToken ? { Authorization: 'Bearer token' } : {},
  })

describe('admin stats routes', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/admin/stats', adminOnly, adminStatsRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns the stats of the period', async () => {
    // Given a logged admin
    loginAs('admin')
    const stats = { from: '2026-10-14', to: '2026-11-12', revenueCents: 7500 }
    vi.mocked(getAdminStats).mockResolvedValue(stats as never)

    // When the admin asks for the last 30 days
    const response = await getStats(PERIOD)

    // Then the stats of that period are returned
    expect(response.status).toBe(200)
    expect(getAdminStats).toHaveBeenCalledWith({ from: '2026-10-14', to: '2026-11-12' })
    expect(await response.json()).toEqual(stats)
  })

  it('responds 400 when the range is backwards', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin sends the dates the other way round
    const response = await getStats('?from=2026-11-12&to=2026-10-14')

    // Then the request is rejected without searching
    expect(response.status).toBe(400)
    expect(getAdminStats).not.toHaveBeenCalled()
  })

  it('responds 400 when a date is not real', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin sends the 30th of February
    const response = await getStats('?from=2026-02-30&to=2026-03-10')

    // Then the request is rejected without searching
    expect(response.status).toBe(400)
    expect(getAdminStats).not.toHaveBeenCalled()
  })

  it('responds 401 to a visitor without token', async () => {
    // Given a visitor without token
    // When the visitor asks for the stats
    const response = await getStats(PERIOD, false)

    // Then the request is rejected
    expect(response.status).toBe(401)
    expect(getAdminStats).not.toHaveBeenCalled()
  })

  it('responds 403 when a customer asks for the stats', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer calls the admin endpoint
    const response = await getStats(PERIOD)

    // Then the request is rejected
    expect(response.status).toBe(403)
    expect(getAdminStats).not.toHaveBeenCalled()
  })
})

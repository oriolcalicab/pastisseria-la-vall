import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAdminOrder, listAdminOrders } from '../services/adminOrderService.js'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import adminOrderRouter from './adminOrderRoutes.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/adminOrderService.js', () => ({
  listAdminOrders: vi.fn(),
  getAdminOrder: vi.fn(),
}))

let server: TestServer

const loginAs = (role: 'customer' | 'admin') => {
  vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
  vi.mocked(findUserByFirebaseUid).mockResolvedValue({ id: 1, role } as never)
}

const getOrders = (path = '') =>
  fetch(`${server.baseUrl}/api/admin/orders${path}`, {
    headers: { Authorization: 'Bearer token' },
  })

describe('admin order routes', () => {
  beforeAll(async () => {
    const app = express()
    app.use('/api/admin/orders', adminOnly, adminOrderRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('lists the orders with the page and the status of the query', async () => {
    // Given a logged admin
    loginAs('admin')
    const page = { items: [], page: 2, pageSize: 20, total: 21, totalPages: 2 }
    vi.mocked(listAdminOrders).mockResolvedValue(page)

    // When the admin asks for the second page of the ready orders
    const response = await getOrders('?page=2&status=ready')

    // Then the list is returned for that page and status
    expect(response.status).toBe(200)
    expect(listAdminOrders).toHaveBeenCalledWith({ page: 2, pageSize: 20, status: 'ready' })
    expect(await response.json()).toEqual(page)
  })

  it('responds 400 when the status does not exist', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin asks for an unknown status
    const response = await getOrders('?status=lost')

    // Then the request is rejected without searching
    expect(response.status).toBe(400)
    expect(listAdminOrders).not.toHaveBeenCalled()
  })

  it('returns the order with its customer', async () => {
    // Given an order of any customer
    loginAs('admin')
    const order = { id: 7, orderNumber: 'LV-261106-4F2A9C', user: { name: 'Anna' } }
    vi.mocked(getAdminOrder).mockResolvedValue(order as never)

    // When the admin asks for it
    const response = await getOrders('/7')

    // Then the order is returned
    expect(response.status).toBe(200)
    expect(getAdminOrder).toHaveBeenCalledWith(7)
    expect(await response.json()).toEqual(order)
  })

  it('responds 404 when the order does not exist', async () => {
    // Given an id without order
    loginAs('admin')
    vi.mocked(getAdminOrder).mockResolvedValue(null)

    // When the admin asks for it
    const response = await getOrders('/999')

    // Then the order is not found
    expect(response.status).toBe(404)
  })

  it('responds 403 when a customer asks for the orders', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer calls the admin endpoint
    const response = await getOrders()

    // Then the request is rejected and nothing is searched
    expect(response.status).toBe(403)
    expect(listAdminOrders).not.toHaveBeenCalled()
  })
})

import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { adminOnly } from '../middleware/adminOnly.js'
import { changeOrderStatus, getAdminOrder, listAdminOrders } from '../services/adminOrderService.js'
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
  changeOrderStatus: vi.fn(),
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

const patchStatus = (id: string, body: object) =>
  fetch(`${server.baseUrl}/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(body),
  })

describe('admin order routes', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
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

  it('changes the status in the name of the logged admin', async () => {
    // Given a logged admin and a pending order
    loginAs('admin')
    const order = { id: 7, status: 'preparing' }
    vi.mocked(changeOrderStatus).mockResolvedValue({ ok: true, order } as never)

    // When the admin starts preparing it
    const response = await patchStatus('7', { status: 'preparing' })

    // Then the change is made by the admin of the token and the order is returned
    expect(response.status).toBe(200)
    expect(changeOrderStatus).toHaveBeenCalledWith(7, 'preparing', 1)
    expect(await response.json()).toEqual(order)
  })

  it('responds 409 when the transition is not valid', async () => {
    // Given a delivered order
    loginAs('admin')
    vi.mocked(changeOrderStatus).mockResolvedValue({
      ok: false,
      reason: 'invalid_transition',
      from: 'delivered',
    })

    // When the admin tries to set it as pending
    const response = await patchStatus('7', { status: 'pending' })

    // Then the request is rejected with both statuses
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      error: 'La comanda no pot passar a aquest estat',
      from: 'delivered',
      to: 'pending',
    })
  })

  it('responds 404 when the order to change does not exist', async () => {
    // Given an id without order
    loginAs('admin')
    vi.mocked(changeOrderStatus).mockResolvedValue({ ok: false, reason: 'not_found' })

    // When the admin changes its status
    const response = await patchStatus('999', { status: 'preparing' })

    // Then the order is not found
    expect(response.status).toBe(404)
  })

  it('responds 400 when the new status does not exist', async () => {
    // Given a logged admin
    loginAs('admin')

    // When the admin sends an unknown status
    const response = await patchStatus('7', { status: 'lost' })

    // Then the request is rejected without changing anything
    expect(response.status).toBe(400)
    expect(changeOrderStatus).not.toHaveBeenCalled()
  })

    it('responds 403 when a customer tries to change the status', async () => {
    // Given a logged customer
    loginAs('customer')

    // When the customer tries to cancel an order
    const response = await patchStatus('7', { status: 'cancelled' })

    // Then the request is rejected and nothing changes
    expect(response.status).toBe(403)
    expect(changeOrderStatus).not.toHaveBeenCalled()
  })
})

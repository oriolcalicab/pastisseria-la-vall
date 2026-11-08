import express from 'express'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createOrder, getCustomerOrder, listCustomerOrders } from '../services/orderService.js'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { findUserByFirebaseUid } from '../services/userService.js'
import { startTestServer } from '../test/startTestServer.js'
import type { TestServer } from '../test/startTestServer.js'
import orderRouter from './orderRoutes.js'

vi.mock('../services/tokenService.js', () => ({ verifyFirebaseToken: vi.fn() }))
vi.mock('../services/userService.js', () => ({ findUserByFirebaseUid: vi.fn() }))
vi.mock('../services/orderService.js', () => ({
  createOrder: vi.fn(),
  getCustomerOrder: vi.fn(),
  listCustomerOrders: vi.fn(),
}))

let server: TestServer

const validOrder = {
  idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
  deliveryDate: '2026-11-12',
  deliveryMethod: 'pickup',
  pickupPointId: 2,
  userId: 99,
  lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
}

const postOrder = (
  body: object,
  headers: Record<string, string> = { Authorization: 'Bearer token' },
) =>
  fetch(`${server.baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

const getOrder = (
  id: string,
  headers: Record<string, string> = { Authorization: 'Bearer token' },
) => fetch(`${server.baseUrl}/api/orders/${id}`, { headers })

describe('order routes', () => {
  beforeAll(async () => {
    const app = express()
    app.use(express.json())
    app.use('/api/orders', orderRouter)
    server = await startTestServer(app)
  })

  afterAll(() => {
    server.close()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(verifyFirebaseToken).mockResolvedValue({ uid: 'u1', email: 'a@b.com' })
    vi.mocked(findUserByFirebaseUid).mockResolvedValue({ id: 5, role: 'customer' } as never)
  })

  it('creates the order for the user of the token', async () => {
    // Given a logged customer
    const order = { id: 1, orderNumber: 'LV-261106-4F2A9C', status: 'pending', totalCents: 7800 }
    vi.mocked(createOrder).mockResolvedValue({ ok: true, order, isNew: true })

    // When the customer sends an order that also tries to set another user
    const response = await postOrder(validOrder)

    // Then the order is created for the user of the token
    expect(response.status).toBe(201)
    expect(createOrder).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ deliveryDate: '2026-11-12' }),
      expect.any(Date),
    )
    expect(await response.json()).toEqual(order)
  })

  it('responds 400 when the order is not valid', async () => {
    // Given a logged customer
    // When the customer sends an order without products
    const response = await postOrder({ ...validOrder, lines: [] })

    // Then the request is rejected and nothing is created
    expect(response.status).toBe(400)
    expect(createOrder).not.toHaveBeenCalled()
  })

  it('responds 409 with the warnings when the cart changed', async () => {
    // Given a price that changed
    const warnings = [{ variantId: 12, type: 'price_changed' as const }]
    vi.mocked(createOrder).mockResolvedValue({ ok: false, reason: 'cart_changed', warnings })

    // When the customer sends the order
    const response = await postOrder(validOrder)

    // Then the customer is told what changed
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      error: 'Alguns productes han canviat. Revisa el carretó',
      reason: 'cart_changed',
      warnings,
    })
  })

  it('responds 409 when the date is no longer available', async () => {
    // Given a day that became full
    vi.mocked(createOrder).mockResolvedValue({ ok: false, reason: 'date_unavailable' })

    // When the customer sends the order
    const response = await postOrder(validOrder)

    // Then the customer is told to choose another date
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      error: 'La data de lliurament ja no està disponible',
      reason: 'date_unavailable',
    })
  })

  it('responds 401 to a visitor without token', async () => {
    // Given a visitor without token
    // When the visitor sends an order
    const response = await postOrder(validOrder, {})

    // Then the request is rejected and nothing is created
    expect(response.status).toBe(401)
    expect(createOrder).not.toHaveBeenCalled()
  })

  it('responds 200 with the same order when it was already created', async () => {
    // Given an order already created with this key
    const order = { id: 1, orderNumber: 'LV-261106-4F2A9C', status: 'pending', totalCents: 7800 }
    vi.mocked(createOrder).mockResolvedValue({ ok: true, order, isNew: false })

    // When the customer sends the same order again
    const response = await postOrder(validOrder)

    // Then the existing order is returned without creating another one
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(order)
  })

  it('returns the order of the customer', async () => {
    // Given an order of the logged customer
    const order = { id: 1, orderNumber: 'LV-261106-4F2A9C', deliveryDate: '2026-11-12' }
    vi.mocked(getCustomerOrder).mockResolvedValue(order as never)

    // When the customer asks for it
    const response = await getOrder('1')

    // Then it is searched for the user of the token and returned
    expect(response.status).toBe(200)
    expect(getCustomerOrder).toHaveBeenCalledWith(5, 1)
    expect(await response.json()).toEqual(order)
  })

  it('responds 404 when the order is of another customer', async () => {
    // Given an order that is not of the logged customer
    vi.mocked(getCustomerOrder).mockResolvedValue(null)

    // When the customer asks for it
    const response = await getOrder('1')

    // Then the order is not found
    expect(response.status).toBe(404)
  })

  it('responds 400 when the id is not valid', async () => {
    // Given a logged customer
    // When the customer asks for an id that is not a number
    const response = await getOrder('abc')

    // Then the request is rejected without searching
    expect(response.status).toBe(400)
    expect(getCustomerOrder).not.toHaveBeenCalled()
  })

  it('responds 401 when a visitor asks for an order', async () => {
    // Given a visitor without token
    // When the visitor asks for an order
    const response = await getOrder('1', {})

    // Then the request is rejected
    expect(response.status).toBe(401)
    expect(getCustomerOrder).not.toHaveBeenCalled()
  })

  it('returns the orders of the customer of the token', async () => {
    // Given a customer with one order
    const orders = [{ id: 1, orderNumber: 'LV-261106-4F2A9C', deliveryDate: '2026-11-12' }]
    vi.mocked(listCustomerOrders).mockResolvedValue(orders as never)

    // When the customer asks for the orders
    const response = await fetch(`${server.baseUrl}/api/orders`, {
      headers: { Authorization: 'Bearer token' },
    })

    // Then the orders of the user of the token are returned
    expect(response.status).toBe(200)
    expect(listCustomerOrders).toHaveBeenCalledWith(5)
    expect(await response.json()).toEqual(orders)
  })

  it('responds 401 when a visitor asks for the orders', async () => {
    // Given a visitor without token
    // When the visitor asks for the orders
    const response = await fetch(`${server.baseUrl}/api/orders`)

    // Then the request is rejected
    expect(response.status).toBe(401)
    expect(listCustomerOrders).not.toHaveBeenCalled()
  })
})

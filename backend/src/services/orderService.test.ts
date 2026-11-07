import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import type { CreateOrderRequest } from '../types/order.js'
import { findCartVariants } from './cartService.js'
import { getDeliveryDates } from './deliveryService.js'
import { createOrder, getCustomerOrder } from './orderService.js'
import { getMaxOrdersPerDay, getShippingFeeCents } from './settingsService.js'
import { Prisma } from '../generated/prisma/client.js'

const tx = vi.hoisted(() => ({
  $executeRaw: vi.fn(),
  order: { count: vi.fn(), create: vi.fn() },
  productVariant: { updateMany: vi.fn() },
}))

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    pickupPoint: { findFirst: vi.fn() },
    order: { findUnique: vi.fn(), findFirst: vi.fn() },
    $transaction: vi.fn(),
  },
}))
vi.mock('./cartService.js', () => ({ findCartVariants: vi.fn() }))
vi.mock('./deliveryService.js', () => ({ getDeliveryDates: vi.fn() }))
vi.mock('./settingsService.js', () => ({
  getShippingFeeCents: vi.fn(),
  getMaxOrdersPerDay: vi.fn(),
}))

const now = new Date('2026-11-06T10:00:00Z')

const cake = {
  id: 12,
  name: '6 racions',
  priceCents: 3900,
  stock: 5,
  isActive: true,
  product: { id: 7, name: 'Pastís de xocolata', imageUrl: null, isActive: true },
}

const cupcakes = {
  id: 20,
  name: 'Caixa de 4',
  priceCents: 1400,
  stock: 5,
  isActive: true,
  product: { id: 8, name: 'Cupcakes de vainilla', imageUrl: null, isActive: true },
}

const pickupRequest: CreateOrderRequest = {
  idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
  deliveryDate: '2026-11-12',
  delivery: { method: 'pickup', pickupPointId: 2 },
  lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
}

const deliveryRequest: CreateOrderRequest = {
  ...pickupRequest,
  delivery: {
    method: 'delivery',
    address: { address: 'Carrer de Mallorca, 120', city: 'Barcelona', postalCode: '08036' },
  },
}

describe('createOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null)
    vi.mocked(getDeliveryDates).mockResolvedValue({
      month: '2026-11',
      days: [{ date: '2026-11-12', available: true, reason: null }],
    })
    vi.mocked(prisma.pickupPoint.findFirst).mockResolvedValue({ id: 2 } as never)
    vi.mocked(findCartVariants).mockResolvedValue([cake, cupcakes] as never)
    vi.mocked(getShippingFeeCents).mockResolvedValue(500)
    vi.mocked(getMaxOrdersPerDay).mockResolvedValue(5)
    vi.mocked(prisma.$transaction).mockImplementation(((callback: (client: typeof tx) => unknown) =>
      callback(tx)) as never)
    tx.order.count.mockResolvedValue(4)
    tx.productVariant.updateMany.mockResolvedValue({ count: 1 })
    tx.order.create.mockResolvedValue({
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      status: 'pending',
      totalCents: 7800,
    })
  })

  it('locks the day, takes the stock and saves the order with its lines and history', async () => {
    // Given an available date with one free place and enough stock
    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then the day is locked, the stock is taken and the order is saved
    expect(result).toMatchObject({
      ok: true,
      isNew: true,
      order: { orderNumber: 'LV-261106-4F2A9C' },
    })
    expect(tx.$executeRaw.mock.calls[0]).toContain(20261112)
    expect(tx.order.count).toHaveBeenCalledWith({
      where: { deliveryDate: new Date('2026-11-12T00:00:00Z'), status: { not: 'cancelled' } },
    })
    expect(tx.productVariant.updateMany).toHaveBeenCalledWith({
      where: { id: 12, isActive: true, product: { isActive: true }, stock: { gte: 2 } },
      data: { stock: { decrement: 2 } },
    })
    expect(tx.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 5,
          pickupPointId: 2,
          totalCents: 7800,
          items: {
            create: [
              {
                variantId: 12,
                productName: 'Pastís de xocolata',
                variantName: '6 racions',
                unitPriceCents: 3900,
                quantity: 2,
                lineTotalCents: 7800,
              },
            ],
          },
          statusHistory: { create: { toStatus: 'pending', changedBy: 5 } },
        }),
      }),
    )
  })

  it('saves the address and the shipping of a home delivery', async () => {
    // Given a home delivery
    // When the order is created
    await createOrder(5, deliveryRequest, now)

    // Then the address and the shipping are saved
    expect(tx.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          deliveryMethod: 'delivery',
          shippingAddress: 'Carrer de Mallorca, 120',
          shippingCity: 'Barcelona',
          shippingPostalCode: '08036',
          shippingCents: 500,
          totalCents: 8300,
        }),
      }),
    )
    expect(prisma.pickupPoint.findFirst).not.toHaveBeenCalled()
  })

  it('does not create the order when the date is no longer available', async () => {
    // Given a day that is no longer available
    vi.mocked(getDeliveryDates).mockResolvedValue({
      month: '2026-11',
      days: [{ date: '2026-11-12', available: false, reason: 'sunday' }],
    })

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then no transaction is started
    expect(result).toEqual({ ok: false, reason: 'date_unavailable' })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('does not create the order when the pickup point is not active', async () => {
    // Given a pickup point that was deactivated
    vi.mocked(prisma.pickupPoint.findFirst).mockResolvedValue(null)

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then no transaction is started
    expect(result).toEqual({ ok: false, reason: 'pickup_point_unavailable' })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('does not create the order when a price changed', async () => {
    // Given a price that changed since the customer saw it
    vi.mocked(findCartVariants).mockResolvedValue([{ ...cake, priceCents: 4200 }] as never)

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then no transaction is started and the customer gets the warning
    expect(result).toEqual({
      ok: false,
      reason: 'cart_changed',
      warnings: [{ variantId: 12, type: 'price_changed' }],
    })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('rejects the order when another order took the last place of the day', async () => {
    // Given the day became full while waiting for the lock
    tx.order.count.mockResolvedValue(5)

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then no stock is taken and nothing is saved
    expect(result).toEqual({ ok: false, reason: 'date_unavailable' })
    expect(tx.productVariant.updateMany).not.toHaveBeenCalled()
    expect(tx.order.create).not.toHaveBeenCalled()
  })

  it('rejects the order when another order took the last units', async () => {
    // Given the stock ran out while waiting for the lock
    tx.productVariant.updateMany.mockResolvedValue({ count: 0 })

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then nothing is saved and the customer is told
    expect(result).toEqual({
      ok: false,
      reason: 'cart_changed',
      warnings: [{ variantId: 12, type: 'out_of_stock' }],
    })
    expect(tx.order.create).not.toHaveBeenCalled()
  })

  it('takes the stock in order of variant to avoid deadlocks', async () => {
    // Given an order with the cupcakes before the cake
    const request = {
      ...pickupRequest,
      lines: [
        { variantId: 20, quantity: 1, priceCents: 1400 },
        { variantId: 12, quantity: 1, priceCents: 3900 },
      ],
    }

    // When the order is created
    await createOrder(5, request, now)

    // Then the cake (12) is updated before the cupcakes (20)
    const updatedIds = tx.productVariant.updateMany.mock.calls.map(([args]) => args.where.id)
    expect(updatedIds).toEqual([12, 20])
  })

  it('does not hide other errors', async () => {
    // Given a database that fails
    tx.order.create.mockRejectedValue(new Error('Connection lost'))

    // When the order is created
    // Then the error goes up to become a server error
    await expect(createOrder(5, pickupRequest, now)).rejects.toThrow('Connection lost')
  })

  const existingOrder = {
    id: 1,
    orderNumber: 'LV-261106-4F2A9C',
    status: 'pending',
    totalCents: 7800,
  }

  it('returns the existing order when the same key is sent again', async () => {
    // Given an order already created with this key
    vi.mocked(prisma.order.findUnique).mockResolvedValue(existingOrder as never)

    // When the same order is sent again
    const result = await createOrder(5, pickupRequest, now)

    // Then the same order is returned and nothing new is done
    expect(result).toEqual({ ok: true, order: existingOrder, isNew: false })
    expect(prisma.order.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_idempotencyKey: { userId: 5, idempotencyKey: pickupRequest.idempotencyKey },
        },
      }),
    )
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('returns the first order when two equal orders arrive at the same time', async () => {
    // Given the other request saved the order while this one was waiting
    const duplicated = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: 'test',
    })
    tx.order.create.mockRejectedValue(duplicated)
    vi.mocked(prisma.order.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingOrder as never)

    // When this order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then the order of the other request is returned
    expect(result).toEqual({ ok: true, order: existingOrder, isNew: false })
  })
})

describe('getCustomerOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('only looks for the order among the orders of the customer', async () => {
    // Given an order of the customer
    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      deliveryDate: new Date('2026-11-12T00:00:00Z'),
    } as never)

    // When the customer asks for it
    const order = await getCustomerOrder(5, 1)

    // Then it is searched with the customer and the date has the short format
    expect(prisma.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1, userId: 5 } }),
    )
    expect(order).toMatchObject({ id: 1, deliveryDate: '2026-11-12' })
  })

  it('returns null when the order is not of the customer', async () => {
    // Given an order that belongs to another customer
    vi.mocked(prisma.order.findFirst).mockResolvedValue(null)

    // When the customer asks for it
    // Then nothing is returned
    expect(await getCustomerOrder(5, 1)).toBeNull()
  })
})

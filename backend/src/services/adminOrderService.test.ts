import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import {
  changeOrderStatus,
  getAdminOrder,
  listAdminOrders,
  listCalendarOrders,
} from './adminOrderService.js'

const tx = vi.hoisted(() => ({
  order: { findUnique: vi.fn(), updateMany: vi.fn() },
  orderStatusHistory: { create: vi.fn() },
  productVariant: { update: vi.fn() },
}))

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    order: { findMany: vi.fn(), count: vi.fn(), findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}))

describe('adminOrderService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('lists one page of the orders with the chosen status', async () => {
    // Given 21 orders being prepared
    const order = {
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      deliveryDate: new Date('2026-11-12T00:00:00Z'),
      user: { name: 'Anna', email: 'anna@test.com' },
    }
    vi.mocked(prisma.$transaction).mockResolvedValue([[order], 21])

    // When the admin asks for the second page
    const result = await listAdminOrders({ page: 2, pageSize: 20, status: 'preparing' })

    // Then the page is filtered by status and has the customer and the short date
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'preparing' }, skip: 20, take: 20 }),
    )
    expect(result).toEqual({
      items: [{ ...order, deliveryDate: '2026-11-12' }],
      page: 2,
      pageSize: 20,
      total: 21,
      totalPages: 2,
    })
  })

  it('lists all the orders when there is no status', async () => {
    // Given no status filter
    vi.mocked(prisma.$transaction).mockResolvedValue([[], 0])

    // When the admin asks for the orders
    await listAdminOrders({ page: 1, pageSize: 20, status: undefined })

    // Then no status is used
    expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }))
  })

  it('returns any order with its customer', async () => {
    // Given an order of a customer
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      deliveryDate: new Date('2026-11-12T00:00:00Z'),
      user: { name: 'Anna', email: 'anna@test.com' },
    } as never)

    // When the admin asks for it
    const order = await getAdminOrder(1)

    // Then it is returned without filtering by user
    expect(prisma.order.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    )
    expect(order).toMatchObject({ deliveryDate: '2026-11-12', user: { name: 'Anna' } })
  })

  it('sends the statuses the order can go to', async () => {
    // Given a pending order
    vi.mocked(prisma.order.findUnique).mockResolvedValue({
      id: 1,
      status: 'pending',
      deliveryDate: new Date('2026-11-12T00:00:00Z'),
    } as never)

    // When the admin asks for it
    const order = await getAdminOrder(1)

    // Then it says it can be prepared or cancelled
    expect(order).toMatchObject({ allowedStatuses: ['preparing', 'cancelled'] })
  })

  it('returns null when the order does not exist', async () => {
    // Given an id without order
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

    // When the admin asks for it
    // Then nothing is returned
    expect(await getAdminOrder(999)).toBeNull()
  })
})

describe('changeOrderStatus', () => {
  const savedOrder = {
    id: 7,
    deliveryDate: new Date('2026-11-12T00:00:00Z'),
    user: { name: 'Anna', email: 'anna@test.com' },
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.$transaction).mockImplementation(((callback: (client: typeof tx) => unknown) =>
      callback(tx)) as never)
    tx.order.updateMany.mockResolvedValue({ count: 1 })
    vi.mocked(prisma.order.findUnique).mockResolvedValue(savedOrder as never)
  })

  it('changes the status and saves who did it', async () => {
    // Given a pending order
    tx.order.findUnique.mockResolvedValue({ status: 'pending', items: [] })

    // When the admin starts preparing it
    const result = await changeOrderStatus(7, 'preparing', 1)

    // Then the status changes only if it is still pending and the change is saved in the history
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: 7, status: 'pending' },
      data: { status: 'preparing' },
    })
    expect(tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: { orderId: 7, fromStatus: 'pending', toStatus: 'preparing', changedBy: 1 },
    })
    expect(tx.productVariant.update).not.toHaveBeenCalled()
    expect(result).toMatchObject({ ok: true, order: { id: 7, deliveryDate: '2026-11-12' } })
  })

  it('puts the stock back when the order is cancelled', async () => {
    // Given a pending order with two products
    tx.order.findUnique.mockResolvedValue({
      status: 'pending',
      items: [
        { variantId: 20, quantity: 1 },
        { variantId: 12, quantity: 2 },
      ],
    })

    // When the admin cancels it
    await changeOrderStatus(7, 'cancelled', 1)

    // Then the units go back to the stock, in the order of the variants
    expect(tx.productVariant.update).toHaveBeenNthCalledWith(1, {
      where: { id: 12 },
      data: { stock: { increment: 2 } },
    })
    expect(tx.productVariant.update).toHaveBeenNthCalledWith(2, {
      where: { id: 20 },
      data: { stock: { increment: 1 } },
    })
  })

  it('does not change anything when the transition is not valid', async () => {
    // Given a delivered order
    tx.order.findUnique.mockResolvedValue({ status: 'delivered', items: [] })

    // When the admin tries to set it as pending
    const result = await changeOrderStatus(7, 'pending', 1)

    // Then nothing is saved
    expect(result).toEqual({ ok: false, reason: 'invalid_transition', from: 'delivered' })
    expect(tx.order.updateMany).not.toHaveBeenCalled()
    expect(tx.orderStatusHistory.create).not.toHaveBeenCalled()
  })

  it('does not put the stock back twice when someone else changed the order first', async () => {
    // Given an order that another admin cancels at the same time
    tx.order.findUnique.mockResolvedValue({
      status: 'pending',
      items: [{ variantId: 12, quantity: 2 }],
    })
    tx.order.updateMany.mockResolvedValue({ count: 0 })

    // When this admin also cancels it
    const result = await changeOrderStatus(7, 'cancelled', 1)

    // Then no history and no stock are saved again
    expect(result).toEqual({ ok: false, reason: 'invalid_transition', from: 'pending' })
    expect(tx.orderStatusHistory.create).not.toHaveBeenCalled()
    expect(tx.productVariant.update).not.toHaveBeenCalled()
  })

  it('returns not found when the order does not exist', async () => {
    // Given an id without order
    tx.order.findUnique.mockResolvedValue(null)

    // When the admin changes its status
    // Then the order is not found
    expect(await changeOrderStatus(999, 'preparing', 1)).toEqual({
      ok: false,
      reason: 'not_found',
    })
  })
})

describe('listCalendarOrders', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('lists the orders of the range that are not cancelled', async () => {
    // Given an order to deliver in the range
    vi.mocked(prisma.order.findMany).mockResolvedValue([
      { id: 7, deliveryDate: new Date('2026-11-12T00:00:00Z') },
    ] as never)

    // When the admin asks for November
    const orders = await listCalendarOrders({ from: '2026-11-01', to: '2026-11-30' })

    // Then only the orders that are not cancelled are searched in the range
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: { not: 'cancelled' },
          deliveryDate: {
            gte: new Date('2026-11-01T00:00:00Z'),
            lte: new Date('2026-11-30T00:00:00Z'),
          },
        },
      }),
    )
    expect(orders).toEqual([{ id: 7, deliveryDate: '2026-11-12' }])
  })
  it('searches only the status and the delivery method of the filters', async () => {
    // Given the admin filters the cancelled orders to pick up
    vi.mocked(prisma.order.findMany).mockResolvedValue([])

    // When the admin asks for November
    await listCalendarOrders({
      from: '2026-11-01',
      to: '2026-11-30',
      status: 'cancelled',
      deliveryMethod: 'pickup',
    })

    // Then the cancelled orders to pick up are searched
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'cancelled',
          deliveryMethod: 'pickup',
          deliveryDate: {
            gte: new Date('2026-11-01T00:00:00Z'),
            lte: new Date('2026-11-30T00:00:00Z'),
          },
        },
      }),
    )
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { getAdminOrder, listAdminOrders } from './adminOrderService.js'

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

  it('returns null when the order does not exist', async () => {
    // Given an id without order
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

    // When the admin asks for it
    // Then nothing is returned
    expect(await getAdminOrder(999)).toBeNull()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { getAdminStats } from './statsService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    order: { groupBy: vi.fn(), findMany: vi.fn() },
    orderItem: { groupBy: vi.fn() },
  },
}))

const query = { from: '2026-11-10', to: '2026-11-12' }

describe('statsService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns the figures of the period without the cancelled orders', async () => {
    // Given two sold orders and one cancelled order in the period
    vi.mocked(prisma.order.groupBy)
      .mockResolvedValueOnce([
        { status: 'pending', _count: { _all: 1 } },
        { status: 'delivered', _count: { _all: 1 } },
        { status: 'cancelled', _count: { _all: 1 } },
      ] as never)
      .mockResolvedValueOnce([{ deliveryMethod: 'pickup', _count: { _all: 2 } }] as never)
    vi.mocked(prisma.orderItem.groupBy).mockResolvedValue([
      { productName: 'Pastís de xocolata', _sum: { quantity: 3, lineTotalCents: 7500 } },
    ] as never)
    vi.mocked(prisma.order.findMany).mockResolvedValue([
      { createdAt: new Date('2026-11-10T10:00:00Z'), totalCents: 2500 },
      { createdAt: new Date('2026-11-12T10:00:00Z'), totalCents: 5000 },
    ] as never)

    // When the admin asks for the stats
    const stats = await getAdminStats(query)

    // Then the revenue only counts the sold orders
    expect(stats.revenueCents).toBe(7500)
    expect(stats.orderCount).toBe(2)
    expect(stats.ordersByStatus).toEqual({
      pending: 1,
      preparing: 0,
      ready: 0,
      delivered: 1,
      cancelled: 1,
    })
    expect(stats.ordersByMethod).toEqual({ delivery: 0, pickup: 2 })
    expect(stats.topProducts).toEqual([
      { productName: 'Pastís de xocolata', quantity: 3, revenueCents: 7500 },
    ])
    expect(stats.salesByDay).toHaveLength(3)
  })

  it('searches from the first day to the end of the last day', async () => {
    // Given a period without orders
    vi.mocked(prisma.order.groupBy).mockResolvedValue([] as never)
    vi.mocked(prisma.orderItem.groupBy).mockResolvedValue([] as never)
    vi.mocked(prisma.order.findMany).mockResolvedValue([])

    // When the admin asks for the stats
    const stats = await getAdminStats(query)

    // Then the sold orders are searched in the whole period, without the cancelled ones
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: new Date('2026-11-10T00:00:00Z'),
          lt: new Date('2026-11-13T00:00:00Z'),
        },
        status: { not: 'cancelled' },
      },
      select: { createdAt: true, totalCents: true },
    })
    expect(stats.revenueCents).toBe(0)
    expect(stats.topProducts).toEqual([])
  })
})

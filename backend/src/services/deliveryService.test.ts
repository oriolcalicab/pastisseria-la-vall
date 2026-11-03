import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { getDeliveryDates } from './deliveryService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    setting: { findMany: vi.fn() },
    closedDate: { findMany: vi.fn() },
    order: { groupBy: vi.fn() },
  },
}))

const now = new Date('2026-11-02T09:00:00Z')

const findDay = (days: { date: string }[], date: string) => days.find((day) => day.date === date)

describe('getDeliveryDates', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.setting.findMany).mockResolvedValue([
      { key: 'min_prep_hours', value: '48' },
      { key: 'max_orders_per_day', value: '5' },
    ])
    vi.mocked(prisma.closedDate.findMany).mockResolvedValue([])
    vi.mocked(prisma.order.groupBy).mockResolvedValue([] as never)
  })

  it('returns every day of the month with its status', async () => {
    // Given a holiday and a full day
    vi.mocked(prisma.closedDate.findMany).mockResolvedValue([
      { date: new Date('2026-11-11T00:00:00Z') },
    ] as never)
    vi.mocked(prisma.order.groupBy).mockResolvedValue([
      { deliveryDate: new Date('2026-11-06T00:00:00Z'), _count: { _all: 5 } },
    ] as never)

    // When the dates of November are requested
    const { month, days } = await getDeliveryDates('2026-11', now)

    // Then every day has its status
    expect(month).toBe('2026-11')
    expect(days).toHaveLength(30)
    expect(findDay(days, '2026-11-05')).toMatchObject({ available: true })
    expect(findDay(days, '2026-11-06')).toMatchObject({ reason: 'full' })
    expect(findDay(days, '2026-11-11')).toMatchObject({ reason: 'closed' })
  })

  it('does not count the cancelled orders', async () => {
    // Given the dates of a month
    // When they are requested
    await getDeliveryDates('2026-11', now)

    // Then only the orders of that month that are not cancelled are counted
    expect(prisma.order.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deliveryDate: {
            gte: new Date('2026-11-01T00:00:00Z'),
            lte: new Date('2026-11-30T00:00:00Z'),
          },
          status: { not: 'cancelled' },
        },
      }),
    )
  })

  it('uses the default limits when the settings are missing', async () => {
    // Given no settings
    vi.mocked(prisma.setting.findMany).mockResolvedValue([])
    vi.mocked(prisma.order.groupBy).mockResolvedValue([
      { deliveryDate: new Date('2026-11-06T00:00:00Z'), _count: { _all: 5 } },
    ] as never)

    // When the dates are requested
    const { days } = await getDeliveryDates('2026-11', now)

    // Then 48 hours and 5 orders are used
    expect(findDay(days, '2026-11-04')).toMatchObject({ reason: 'too_soon' })
    expect(findDay(days, '2026-11-06')).toMatchObject({ reason: 'full' })
  })

    it('only asks for the holidays of the month', async () => {
    // Given the dates of a month
    // When they are requested
    await getDeliveryDates('2026-12', now)

    // Then only the holidays of December are searched
    expect(prisma.closedDate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          date: {
            gte: new Date('2026-12-01T00:00:00Z'),
            lte: new Date('2026-12-31T00:00:00Z'),
          },
        },
      }),
    )
  })
})
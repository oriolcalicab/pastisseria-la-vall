import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { getShippingFeeCents, getMaxOrdersPerDay } from './settingsService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: { setting: { findUnique: vi.fn() } },
}))

describe('getShippingFeeCents', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('reads the shipping fee from the settings', async () => {
    // Given a shipping fee of 650 cents
    vi.mocked(prisma.setting.findUnique).mockResolvedValue({
      key: 'shipping_fee_cents',
      value: '650',
    })

    // When the shipping fee is requested
    // Then it is the value of the setting
    await expect(getShippingFeeCents()).resolves.toBe(650)
    expect(prisma.setting.findUnique).toHaveBeenCalledWith({
      where: { key: 'shipping_fee_cents' },
    })
  })

  it('uses 500 cents when the setting is missing', async () => {
    // Given no shipping fee setting
    vi.mocked(prisma.setting.findUnique).mockResolvedValue(null)

    // When the shipping fee is requested
    // Then the default fee is used
    await expect(getShippingFeeCents()).resolves.toBe(500)
  })
})

describe('getMaxOrdersPerDay', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('reads the maximum of orders per day from the settings', async () => {
    // Given a maximum of 3 orders per day
    vi.mocked(prisma.setting.findUnique).mockResolvedValue({
      key: 'max_orders_per_day',
      value: '3',
    })

    // When the maximum is requested
    // Then it is the value of the setting
    await expect(getMaxOrdersPerDay()).resolves.toBe(3)
    expect(prisma.setting.findUnique).toHaveBeenCalledWith({
      where: { key: 'max_orders_per_day' },
    })
  })

  it('uses 5 orders when the setting is missing', async () => {
    // Given no setting
    vi.mocked(prisma.setting.findUnique).mockResolvedValue(null)

    // When the maximum is requested
    // Then the default is used
    await expect(getMaxOrdersPerDay()).resolves.toBe(5)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { getShippingFeeCents } from './settingsService.js'

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
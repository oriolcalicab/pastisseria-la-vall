import { prisma } from '../lib/prisma.js'
import { readNumberSetting } from '../utils/settings.js'

const getNumberSetting = async (key: string, fallback: number): Promise<number> => {
  const setting = await prisma.setting.findUnique({ where: { key } })

  return readNumberSetting(setting ? [setting] : [], key, fallback)
}

export const getShippingFeeCents = () => getNumberSetting('shipping_fee_cents', 500)

export const getMaxOrdersPerDay = () => getNumberSetting('max_orders_per_day', 5)

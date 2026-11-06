import { prisma } from '../lib/prisma.js'
import { readNumberSetting } from '../utils/settings.js'

const SHIPPING_FEE_KEY = 'shipping_fee_cents'
const DEFAULT_SHIPPING_FEE_CENTS = 500

export const getShippingFeeCents = async (): Promise<number> => {
  const setting = await prisma.setting.findUnique({ where: { key: SHIPPING_FEE_KEY } })

  return readNumberSetting(setting ? [setting] : [], SHIPPING_FEE_KEY, DEFAULT_SHIPPING_FEE_CENTS)
}
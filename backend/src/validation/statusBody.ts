import type { StatusBody } from '../types/order.js'
import { isOrderStatus } from '../utils/orderStatus.js'

export const parseStatusBody = (body: unknown): StatusBody | null => {
  if (typeof body !== 'object' || body === null) return null

  const { status } = body as { status?: unknown }

  return isOrderStatus(status) ? { status } : null
}

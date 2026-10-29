import type { ActiveBody } from '../types/product.js'

export const parseActiveBody = (body: unknown): ActiveBody | null => {
  if (typeof body !== 'object' || body === null) return null

  const { isActive } = body as { isActive?: unknown }

  return typeof isActive === 'boolean' ? { isActive } : null
}
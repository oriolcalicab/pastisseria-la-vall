import type { RequestedCartLine } from '../types/cart.js'

const MAX_LINES = 50
const MAX_INT = 2_147_483_647

const isPositiveInt = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 1 && Number(value) <= MAX_INT

const parseLine = (value: unknown): RequestedCartLine | null => {
  if (typeof value !== 'object' || value === null) return null

  const { variantId, quantity, priceCents } = value as Record<string, unknown>

  if (!isPositiveInt(variantId) || !isPositiveInt(quantity) || !isPositiveInt(priceCents)) {
    return null
  }

  return { variantId, quantity, priceCents }
}

export const parseCartValidateBody = (body: unknown): RequestedCartLine[] | null => {
  if (typeof body !== 'object' || body === null) return null

  const { lines } = body as { lines?: unknown }

  if (!Array.isArray(lines) || lines.length > MAX_LINES) return null

  const parsedLines = lines.map(parseLine)

  if (parsedLines.includes(null)) return null

  const validLines = parsedLines.filter((line) => line !== null)
  const variantIds = new Set(validLines.map((line) => line.variantId))

  return variantIds.size === validLines.length ? validLines : null
}

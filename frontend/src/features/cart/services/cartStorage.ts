import type { CartLine } from '../types/cart'

const CART_STORAGE_KEY = 'pastisseria-la-vall:cart'

const isCartLine = (value: unknown): value is CartLine => {
  if (typeof value !== 'object' || value === null) return false

  const line = value as Record<string, unknown>

  return (
    Number.isInteger(line.variantId) &&
    Number.isInteger(line.productId) &&
    typeof line.productName === 'string' &&
    typeof line.variantName === 'string' &&
    Number.isInteger(line.priceCents) &&
    (line.imageUrl === null || typeof line.imageUrl === 'string') &&
    Number.isInteger(line.quantity) &&
    Number(line.quantity) >= 1
  )
}

export const loadCart = (): CartLine[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)

    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)

    return Array.isArray(parsed) ? parsed.filter(isCartLine) : []
  } catch {
    return []
  }
}

export const saveCart = (lines: CartLine[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Without storage the cart still works until the page is reloaded
  }
}
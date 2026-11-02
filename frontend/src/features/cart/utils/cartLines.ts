import type { CartLine, NewCartLine } from '../types/cart'

const MIN_QUANTITY = 1

export const addLine = (lines: CartLine[], newLine: NewCartLine, quantity = 1): CartLine[] => {
  const isInCart = lines.some((line) => line.variantId === newLine.variantId)

  if (!isInCart) return [...lines, { ...newLine, quantity }]

  return lines.map((line) =>
    line.variantId === newLine.variantId
      ? { ...line, quantity: line.quantity + quantity }
      : line,
  )
}

export const setLineQuantity = (
  lines: CartLine[],
  variantId: number,
  quantity: number,
): CartLine[] => {
  if (quantity < MIN_QUANTITY) return lines

  return lines.map((line) => (line.variantId === variantId ? { ...line, quantity } : line))
}

export const removeLine = (lines: CartLine[], variantId: number): CartLine[] =>
  lines.filter((line) => line.variantId !== variantId)

export const getCartItemCount = (lines: CartLine[]): number =>
  lines.reduce((total, line) => total + line.quantity, 0)

export const getCartTotalCents = (lines: CartLine[]): number =>
  lines.reduce((total, line) => total + line.priceCents * line.quantity, 0)
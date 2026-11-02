import type { CartLine, CartWarning, CartWarningType } from '../types/cart'

const messages: Record<CartWarningType, (name: string) => string> = {
  unavailable: (name) => `${name} ja no està disponible i s'ha tret del carretó.`,
  out_of_stock: (name) => `${name} s'ha esgotat i s'ha tret del carretó.`,
  quantity_reduced: (name) => `No queden prou unitats de ${name} i s'ha ajustat la quantitat.`,
  price_changed: (name) => `El preu de ${name} ha canviat.`,
}

export const getCartNotices = (warnings: CartWarning[], lines: CartLine[]): string[] =>
  warnings.map(({ variantId, type }) => {
    const line = lines.find((item) => item.variantId === variantId)
    const name = line ? `${line.productName} (${line.variantName})` : 'Un producte'

    return messages[type](name)
  })
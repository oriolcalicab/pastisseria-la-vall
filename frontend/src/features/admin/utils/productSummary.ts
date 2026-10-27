import type { AdminProductVariant } from '../types/product'

const priceFormatter = new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' })

export const formatPrice = (cents: number): string => priceFormatter.format(cents / 100)

export const getFromPriceCents = (variants: AdminProductVariant[]): number | null => {
  const activePrices = variants.filter((variant) => variant.isActive).map((variant) => variant.priceCents)

  return activePrices.length > 0 ? Math.min(...activePrices) : null
}

export const getTotalStock = (variants: AdminProductVariant[]): number =>
  variants.reduce((total, variant) => total + variant.stock, 0)
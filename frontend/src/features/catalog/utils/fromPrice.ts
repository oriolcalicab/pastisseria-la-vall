import type { ProductVariant } from '../types/product'

export const getFromPriceCents = (variants: ProductVariant[]): number =>
  Math.min(...variants.map((variant) => variant.priceCents))
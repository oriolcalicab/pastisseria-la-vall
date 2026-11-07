import type { ProductVariant } from '../types/product'

export const getDefaultVariant = (variants: ProductVariant[]): ProductVariant | null =>
  variants.find((variant) => variant.inStock) ?? null

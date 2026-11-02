export type CartLine = {
  variantId: number
  productId: number
  productName: string
  variantName: string
  priceCents: number
  imageUrl: string | null
  quantity: number
}

export type NewCartLine = Omit<CartLine, 'quantity'>

export type CartWarningType = 'unavailable' | 'out_of_stock' | 'quantity_reduced' | 'price_changed'

export type CartWarning = {
  variantId: number
  type: CartWarningType
}

export type ValidatedCart = {
  lines: CartLine[]
  warnings: CartWarning[]
  totalCents: number
}
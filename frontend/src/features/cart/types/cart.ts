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
export type RequestedCartLine = {
  variantId: number
  quantity: number
  priceCents: number
}

export type CartVariant = {
  id: number
  name: string
  priceCents: number
  stock: number
  isActive: boolean
  product: {
    id: number
    name: string
    imageUrl: string | null
    isActive: boolean
  }
}

export type ValidatedCartLine = {
  variantId: number
  productId: number
  productName: string
  variantName: string
  priceCents: number
  imageUrl: string | null
  quantity: number
}

export type CartWarningType = 'unavailable' | 'out_of_stock' | 'quantity_reduced' | 'price_changed'

export type CartWarning = {
  variantId: number
  type: CartWarningType
}
export type ProductVariant = {
  id: number
  name: string
  priceCents: number
  inStock: boolean
}

export type Product = {
  id: number
  name: string
  description: string
  imageUrl: string | null
  allergens: string | null
  isGlutenFree: boolean
  isPlantMilk: boolean
  isVegan: boolean
  category: { id: number; name: string; slug: string }
  variants: ProductVariant[]
}

export type ProductPage = {
  items: Product[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
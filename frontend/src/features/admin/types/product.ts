export type AdminProductVariant = {
  id: number
  name: string
  priceCents: number
  stock: number
  isActive: boolean
}

export type AdminProduct = {
  id: number
  name: string
  isActive: boolean
  category: { id: number; name: string }
  variants: AdminProductVariant[]
}

export type AdminProductPage = {
  items: AdminProduct[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type NewProductVariant = {
  name: string
  priceCents: number
  stock: number
}

export type NewProduct = {
  categoryId: number
  name: string
  description: string
  allergens: string
  isGlutenFree: boolean
  isPlanMilk: boolean
  isVegan: boolean
  isActive: boolean
  variants: NewProductVariant[]
}
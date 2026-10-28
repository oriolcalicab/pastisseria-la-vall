export type NewVariant = {
  name: string
  priceCents: number
  stock: number
  sortOrder: number
}

export type NewProduct = {
  categoryId: number
  name: string
  description: string
  allergens: string | null
  isGlutenFree: boolean
  isPlantMilk: boolean
  isVegan: boolean
  isActive: boolean
  variants: NewVariant[]
}

export type ProductListQuery = {
  page: number
  pageSize: number
  search: string | undefined
}

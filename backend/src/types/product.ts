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

export type VariantInput = NewVariant & {
  id: number | null
}

export type ProductUpdate = Omit<NewProduct, 'variants'> & {
  variants: VariantInput[]
}

export type ProductListQuery = {
  page: number
  pageSize: number
  search: string | undefined
}

export type ActiveBody = {
  isActive: boolean
}

export type Diet = 'gluten_free' | 'plant_milk' | 'vegan'

export type PublicProductQuery = {
  page: number
  pageSize: number
  category: string | undefined
  diets: Diet[]
}

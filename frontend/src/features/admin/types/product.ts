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
  id?: number
  priceCents: number
  stock: number
}

export type NewProduct = {
  categoryId: number
  name: string
  description: string
  allergens: string
  imageUrl: string | null
  isGlutenFree: boolean
  isPlantMilk: boolean
  isVegan: boolean
  isActive: boolean
  variants: NewProductVariant[]
}

export type AdminProductDetail = AdminProduct & {
  categoryId: number
  description: string
  allergens: string | null
  imageUrl: string | null
  isGlutenFree: boolean
  isPlantMilk: boolean
  isVegan: boolean
}

export type ProductStatusFilter = '' | 'active' | 'inactive'

export type AdminProductsParams = {
  page: number
  search: string
  categoryId?: string
  status?: ProductStatusFilter
}

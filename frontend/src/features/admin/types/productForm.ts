export type VariantFormValues = {
  key: number
  name: string
  price: string
  stock: string
}

export type ProductFormValues = {
  categoryId: string
  name: string
  description: string
  allergens: string
  isGlutenFree: boolean
  isPlantMilk: boolean
  isVegan: boolean
  isActive: boolean
  variants: VariantFormValues[]
}

export type VariantFormErrors = Partial<Record<'name' | 'price' | 'stock', string>>

export type ProductFormErrors = Partial<
  Record<'categoryId' | 'name' | 'description' | 'allergens' | 'variants', string>
> & {
  variantErrors?: VariantFormErrors[]
}
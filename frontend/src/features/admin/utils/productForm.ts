import type { NewProduct, NewProductVariant } from '../types/product'
import type {
  ProductFormErrors,
  ProductFormValues,
  VariantFormErrors,
  VariantFormValues,
} from '../types/productForm'

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 2000
const MAX_ALLERGENS_LENGTH = 300
const MAX_VARIANT_NAME_LENGTH = 50
const MAX_VARIANTS = 20
const MAX_PRICE_CENTS = 1_000_000
const MAX_STOCK = 100_000

const PRICE_PATTERN = /^\d+([.,]\d{1,2})?$/
const STOCK_PATTERN = /^\d+$/

type ProductFormResult = { ok: true; product: NewProduct } | { ok: false; errors: ProductFormErrors }

export const parseEurosToCents = (value: string): number | null => {
  const trimmed = value.trim()

  if (!PRICE_PATTERN.test(trimmed)) return null

  return Math.round(Number(trimmed.replace(',', '.')) * 100)
}

const parseStock = (value: string): number | null => {
  const trimmed = value.trim()

  return STOCK_PATTERN.test(trimmed) ? Number(trimmed) : null
}

const validateVariant = (values: VariantFormValues) => {
  const errors: VariantFormErrors = {}
  const name = values.name.trim()
  const priceCents = parseEurosToCents(values.price)
  const stock = parseStock(values.stock)

  if (!name || name.length > MAX_VARIANT_NAME_LENGTH) {
    errors.name = `Escriu un nom de fins a ${MAX_VARIANT_NAME_LENGTH} caràcters`
  }

  if (priceCents === null || priceCents <= 0 || priceCents > MAX_PRICE_CENTS) {
    errors.price = 'Escriu un preu més gran que 0, amb 2 decimals com a màxim'
  }

  if (stock === null || stock > MAX_STOCK) {
    errors.stock = 'Escriu un stock enter, 0 o més'
  }

  const variant: NewProductVariant = { name, priceCents: priceCents ?? 0, stock: stock ?? 0 }

  return { errors, variant }
}

const hasErrors = (errors: object) => Object.keys(errors).length > 0

export const validateProductForm = (values: ProductFormValues): ProductFormResult => {
  const errors: ProductFormErrors = {}
  const name = values.name.trim()
  const description = values.description.trim()
  const allergens = values.allergens.trim()

  if (!values.categoryId) errors.categoryId = 'Tria una categoria'

  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    errors.name = `El nom ha de tenir entre ${MIN_NAME_LENGTH} i ${MAX_NAME_LENGTH} caràcters`
  }

  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Escriu una descripció de fins a ${MAX_DESCRIPTION_LENGTH} caràcters`
  }

  if (allergens.length > MAX_ALLERGENS_LENGTH) {
    errors.allergens = `Els al·lèrgens poden tenir fins a ${MAX_ALLERGENS_LENGTH} caràcters`
  }

  if (values.variants.length === 0) {
    errors.variants = 'Afegeix com a mínim una variant'
  } else if (values.variants.length > MAX_VARIANTS) {
    errors.variants = `Un producte pot tenir fins a ${MAX_VARIANTS} variants`
  }

  const variants = values.variants.map(validateVariant)
  const variantErrors = variants.map((variant) => variant.errors)

  if (variantErrors.some(hasErrors)) errors.variantErrors = variantErrors

  if (hasErrors(errors)) return { ok: false, errors }

  return {
    ok: true,
    product: {
      categoryId: Number(values.categoryId),
      name,
      description,
      allergens,
      isGlutenFree: values.isGlutenFree,
      isPlantMilk: values.isPlantMilk,
      isVegan: values.isVegan,
      isActive: values.isActive,
      variants: variants.map((variant) => variant.variant),
    },
  }
}
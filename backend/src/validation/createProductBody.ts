import type { NewProduct, NewVariant } from '../types/product.js'

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 2000
const MAX_ALLERGENS_LENGTH = 300
const MAX_VARIANT_NAME_LENGTH = 50
const MAX_VARIANTS = 20
const MAX_PRICE_CENTS = 1_000_000
const MAX_STOCK = 100_000

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const fail = (error: string) => ({ ok: false as const, error })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isInteger = (value: unknown): value is number => Number.isInteger(value)

const parseText = (value: unknown, minLength: number, maxLength: number): string | null => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()

  return trimmed.length >= minLength && trimmed.length <= maxLength ? trimmed : null
}

const parseFlag = (value: unknown, defaultValue: boolean): boolean | null => {
  if (value === undefined) return defaultValue

  return typeof value === 'boolean' ? value : null
}

const parseVariant = (value: unknown, position: number): Result<NewVariant> => {
  if (!isRecord(value)) return fail(`La variant ${position} no és vàlida`)

  const name = parseText(value.name, 1, MAX_VARIANT_NAME_LENGTH)

  if (name === null) return fail(`La variant ${position} necessita un nom`)

  const { priceCents, stock } = value

  if (!isInteger(priceCents) || priceCents <= 0 || priceCents > MAX_PRICE_CENTS) {
    return fail(`El preu de la variant ${position} ha de ser un enter de cèntims més gran que 0`)
  }

  if (!isInteger(stock) || stock < 0 || stock > MAX_STOCK) {
    return fail(`L'stock de la variant ${position} ha de ser un enter igual o més gran que 0`)
  }

  return { ok: true, data: { name, priceCents, stock, sortOrder: position - 1 } }
}

const parseVariants = (value: unknown): Result<NewVariant[]> => {
  if (!Array.isArray(value) || value.length === 0) {
    return fail('El producte ha de tenir com a mínim una variant')
  }

  if (value.length > MAX_VARIANTS)
    return fail(`Un producte no pot tenir més de ${MAX_VARIANTS} variants`)

  const variants: NewVariant[] = []

  for (const [index, item] of value.entries()) {
    const variant = parseVariant(item, index + 1)

    if (!variant.ok) return variant

    variants.push(variant.data)
  }

  return { ok: true, data: variants }
}

export const parseCreateProductBody = (body: unknown): Result<NewProduct> => {
  if (!isRecord(body)) return fail('El cos de la petició no és vàlid')

  const { categoryId, allergens } = body

  if (!isInteger(categoryId) || categoryId < 1) return fail('La categoria no és vàlida')

  const name = parseText(body.name, MIN_NAME_LENGTH, MAX_NAME_LENGTH)

  if (name === null) {
    return fail(`El nom ha de tenir entre ${MIN_NAME_LENGTH} i ${MAX_NAME_LENGTH} caràcters`)
  }

  const description = parseText(body.description, 1, MAX_DESCRIPTION_LENGTH)

  if (description === null) return fail('La descripció és obligatòria')

  if (allergens !== undefined && allergens !== null && typeof allergens !== 'string') {
    return fail('Els al·lèrgens no són vàlids')
  }

  const trimmedAllergens = typeof allergens === 'string' ? allergens.trim() : ''

  if (trimmedAllergens.length > MAX_ALLERGENS_LENGTH) return fail('Els al·lèrgens són massa llargs')

  const isGlutenFree = parseFlag(body.isGlutenFree, false)
  const isPlantMilk = parseFlag(body.isPlantMilk, false)
  const isVegan = parseFlag(body.isVegan, false)
  const isActive = parseFlag(body.isActive, true)

  if (isGlutenFree === null || isPlantMilk === null || isVegan === null || isActive === null) {
    return fail('Les opcions del producte han de ser true o false')
  }

  const variants = parseVariants(body.variants)

  if (!variants.ok) return variants

  return {
    ok: true,
    data: {
      categoryId,
      name,
      description,
      allergens: trimmedAllergens || null,
      isGlutenFree,
      isPlantMilk,
      isVegan,
      isActive,
      variants: variants.data,
    },
  }
}

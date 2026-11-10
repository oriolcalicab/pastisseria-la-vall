import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import type {
  Diet,
  NewProduct,
  ProductListQuery,
  ProductUpdate,
  PublicProductQuery,
} from '../types/product.js'
import { containsPattern } from '../utils/likePattern.js'

const productInclude = {
  category: true,
  variants: { orderBy: { sortOrder: 'asc' } },
} satisfies Prisma.ProductInclude

const publicProductSelect = {
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  allergens: true,
  isGlutenFree: true,
  isPlantMilk: true,
  isVegan: true,
  category: { select: { id: true, name: true, slug: true } },
  variants: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, priceCents: true, stock: true },
  },
} satisfies Prisma.ProductSelect

type PublicProductRow = Prisma.ProductGetPayload<{ select: typeof publicProductSelect }>

const toPublicProduct = ({ variants, ...product }: PublicProductRow) => ({
  ...product,
  variants: variants.map(({ stock, ...variant }) => ({ ...variant, inStock: stock > 0 })),
})

const dietFilters: Record<Diet, Prisma.ProductWhereInput> = {
  gluten_free: { isGlutenFree: true },
  plant_milk: { isPlantMilk: true },
  vegan: { isVegan: true },
}

const findProductIdsByName = async (search: string): Promise<number[]> => {
  const rows = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id FROM products WHERE unaccent(name) ILIKE unaccent(${containsPattern(search)})
  `

  return rows.map((row) => row.id)
}

export const listProducts = async ({ page, pageSize, search }: ProductListQuery) => {
  const where: Prisma.ProductWhereInput = search
    ? { id: { in: await findProductIdsByName(search) } }
    : {}

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
}

export const createProduct = async (data: NewProduct) => {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } })

  if (!category) return null

  const { variants, ...product } = data

  return prisma.product.create({
    data: { ...product, variants: { create: variants } },
    include: productInclude,
  })
}

export const setProductActive = async (id: number, isActive: boolean) => {
  const { count } = await prisma.product.updateMany({ where: { id }, data: { isActive } })

  if (count === 0) return null

  return prisma.product.findUnique({ where: { id }, include: productInclude })
}

export const setVariantActive = async (productId: number, variantId: number, isActive: boolean) => {
  const { count } = await prisma.productVariant.updateMany({
    where: { id: variantId, productId },
    data: { isActive },
  })

  if (count === 0) return null

  return prisma.productVariant.findUnique({ where: { id: variantId } })
}

export const listPublicProducts = async ({
  page,
  pageSize,
  category,
  diets,
}: PublicProductQuery) => {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    variants: { some: { isActive: true } },
    ...(category ? { category: { slug: category } } : {}),
    ...(diets.length > 0 ? { AND: diets.map((diet) => dietFilters[diet]) } : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: publicProductSelect,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return {
    items: items.map(toPublicProduct),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export const getPublicProduct = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, isActive: true, variants: { some: { isActive: true } } },
    select: publicProductSelect,
  })

  return product ? toPublicProduct(product) : null
}

type AdminProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>

type UpdateProductResult =
  | { ok: true; product: AdminProductRow }
  | { ok: false; reason: 'product_not_found' | 'category_not_found' | 'variant_not_found' }

export const getAdminProduct = (id: number) =>
  prisma.product.findUnique({ where: { id }, include: productInclude })

export const updateProduct = async (
  id: number,
  data: ProductUpdate,
): Promise<UpdateProductResult> => {
  const { variants, ...product } = data

  return prisma.$transaction(async (tx): Promise<UpdateProductResult> => {
    const existing = await tx.product.findUnique({
      where: { id },
      select: { variants: { select: { id: true } } },
    })

    if (!existing) return { ok: false, reason: 'product_not_found' }

    const category = await tx.category.findUnique({
      where: { id: product.categoryId },
      select: { id: true },
    })

    if (!category) return { ok: false, reason: 'category_not_found' }

    const ownVariantIds = new Set(existing.variants.map((variant) => variant.id))

    if (variants.some((variant) => variant.id !== null && !ownVariantIds.has(variant.id))) {
      return { ok: false, reason: 'variant_not_found' }
    }

    await tx.product.update({ where: { id }, data: product })

    for (const { id: variantId, ...variant } of variants) {
      if (variantId === null) {
        await tx.productVariant.create({ data: { ...variant, productId: id } })
      } else {
        await tx.productVariant.update({ where: { id: variantId }, data: variant })
      }
    }

    const updated = await tx.product.findUniqueOrThrow({ where: { id }, include: productInclude })

    return { ok: true, product: updated }
  })
}

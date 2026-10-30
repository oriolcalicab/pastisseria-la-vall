import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import type { NewProduct, ProductListQuery, PublicProductQuery } from '../types/product.js'
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

export const listPublicProducts = async ({ page, pageSize, category }: PublicProductQuery) => {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    variants: { some: { isActive: true } },
    ...(category ? { category: { slug: category } } : {}),
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

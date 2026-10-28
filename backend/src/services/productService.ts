import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import { NewProduct } from '../types/product.js'
import { containsPattern } from '../utils/likePattern.js'
import type { ProductListQuery } from '../validation/productListQuery.js'

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
      include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
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
    include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
  })
}
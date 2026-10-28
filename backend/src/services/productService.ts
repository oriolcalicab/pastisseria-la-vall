import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
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

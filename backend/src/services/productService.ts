import type { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import type { ProductListQuery } from '../validation/productListQuery.js'

export const listProducts = async ({ page, pageSize, search }: ProductListQuery) => {
  const where: Prisma.ProductWhereInput = search
    ? { name: { contains: search, mode: 'insensitive' } }
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
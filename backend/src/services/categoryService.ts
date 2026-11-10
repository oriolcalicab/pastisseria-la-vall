import { prisma } from '../lib/prisma.js'

export const listCategories = () =>
  prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })

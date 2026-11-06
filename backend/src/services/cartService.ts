import { prisma } from '../lib/prisma.js'
import type { RequestedCartLine } from '../types/cart.js'
import { reconcileCart } from '../utils/reconcileCart.js'

export const findCartVariants = (variantIds: number[]) =>
  prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: {
      id: true,
      name: true,
      priceCents: true,
      stock: true,
      isActive: true,
      product: { select: { id: true, name: true, imageUrl: true, isActive: true } },
    },
  })

export const validateCart = async (lines: RequestedCartLine[]) => {
  const variants = await findCartVariants(lines.map((line) => line.variantId))

  return reconcileCart(lines, variants)
}

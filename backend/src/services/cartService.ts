import { prisma } from '../lib/prisma.js'
import type { RequestedCartLine } from '../types/cart.js'
import { reconcileCart } from '../utils/reconcileCart.js'

export const validateCart = async (lines: RequestedCartLine[]) => {
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: lines.map((line) => line.variantId) } },
    select: {
      id: true,
      name: true,
      priceCents: true,
      stock: true,
      isActive: true,
      product: { select: { id: true, name: true, imageUrl: true, isActive: true } },
    },
  })

  return reconcileCart(lines, variants)
}
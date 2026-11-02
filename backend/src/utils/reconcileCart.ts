import type {
  CartVariant,
  CartWarning,
  RequestedCartLine,
  ValidatedCartLine,
} from '../types/cart.js'

export const reconcileCart = (requestedLines: RequestedCartLine[], variants: CartVariant[]) => {
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]))
  const lines: ValidatedCartLine[] = []
  const warnings: CartWarning[] = []

  for (const { variantId, quantity: requestedQuantity, priceCents } of requestedLines) {
    const variant = variantsById.get(variantId)

    if (!variant || !variant.isActive || !variant.product.isActive) {
      warnings.push({ variantId, type: 'unavailable' })
      continue
    }

    if (variant.stock === 0) {
      warnings.push({ variantId, type: 'out_of_stock' })
      continue
    }

    const quantity = Math.min(requestedQuantity, variant.stock)

    if (quantity < requestedQuantity) warnings.push({ variantId, type: 'quantity_reduced' })
    if (variant.priceCents !== priceCents) warnings.push({ variantId, type: 'price_changed' })

    lines.push({
      variantId,
      productId: variant.product.id,
      productName: variant.product.name,
      variantName: variant.name,
      priceCents: variant.priceCents,
      imageUrl: variant.product.imageUrl,
      quantity,
    })
  }

  const totalCents = lines.reduce((total, line) => total + line.priceCents * line.quantity, 0)

  return { lines, warnings, totalCents }
}
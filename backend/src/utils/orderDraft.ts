import type { CartVariant, CartWarning, RequestedCartLine } from '../types/cart.js'
import type { OrderDraft } from '../types/order.js'
import { reconcileCart } from './reconcileCart.js'

type OrderDraftResult = { ok: true; draft: OrderDraft } | { ok: false; warnings: CartWarning[] }

export const buildOrderDraft = (
  requestedLines: RequestedCartLine[],
  variants: CartVariant[],
  method: 'delivery' | 'pickup',
  shippingFeeCents: number,
): OrderDraftResult => {
  const cart = reconcileCart(requestedLines, variants)

  if (cart.warnings.length > 0) return { ok: false, warnings: cart.warnings }

  const items = cart.lines.map((line) => ({
    variantId: line.variantId,
    productName: line.productName,
    variantName: line.variantName,
    unitPriceCents: line.priceCents,
    quantity: line.quantity,
    lineTotalCents: line.priceCents * line.quantity,
  }))
  const shippingCents = method === 'delivery' ? shippingFeeCents : 0

  return {
    ok: true,
    draft: {
      items,
      subtotalCents: cart.totalCents,
      shippingCents,
      totalCents: cart.totalCents + shippingCents,
    },
  }
}

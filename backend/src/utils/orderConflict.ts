import type { CartWarning } from '../types/cart.js'

export type OrderConflictReason = 'date_unavailable' | 'pickup_point_unavailable' | 'cart_changed'

export class OrderConflictError extends Error {
  reason: OrderConflictReason
  warnings: CartWarning[]

  constructor(reason: OrderConflictReason, warnings: CartWarning[] = []) {
    super(reason)
    this.name = 'OrderConflictError'
    this.reason = reason
    this.warnings = warnings
  }
}

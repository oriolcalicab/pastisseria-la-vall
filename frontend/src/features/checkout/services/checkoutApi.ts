import { apiUrl } from '../../../lib/api'
import type { CartWarning } from '../../cart/types/cart'
import type { CreatedOrder, OrderConflictReason, OrderPayload } from '../types/checkout'

export const fetchShippingFee = async (): Promise<number> => {
  const response = await fetch(apiUrl('/api/checkout/shipping-fee'))

  if (!response.ok) {
    throw new Error(`Shipping fee request failed with status ${response.status}`)
  }

  const body = (await response.json()) as { shippingFeeCents: number }

  return body.shippingFeeCents
}

const CREATE_ORDER_ERROR = "No s'ha pogut confirmar la comanda. Torna-ho a provar"

export class OrderRequestError extends Error {
  warnings: CartWarning[]
  reason: OrderConflictReason | null

  constructor(
    message: string,
    warnings: CartWarning[] = [],
    reason: OrderConflictReason | null = null,
  ) {
    super(message)
    this.name = 'OrderRequestError'
    this.warnings = warnings
    this.reason = reason
  }
}

const conflictReasons: OrderConflictReason[] = [
  'date_unavailable',
  'pickup_point_unavailable',
  'cart_changed',
]

const readReason = (value: unknown): OrderConflictReason | null =>
  conflictReasons.find((reason) => reason === value) ?? null

const readOrderError = async (response: Response): Promise<OrderRequestError> => {
  const body: unknown = await response.json().catch(() => null)

  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return new OrderRequestError(CREATE_ORDER_ERROR)
  }

  const message = typeof body.error === 'string' ? body.error : CREATE_ORDER_ERROR
  const warnings = 'warnings' in body && Array.isArray(body.warnings) ? body.warnings : []
  const reason = 'reason' in body ? readReason(body.reason) : null

  return new OrderRequestError(message, warnings as CartWarning[], reason)
}

export const createOrder = async (token: string, payload: OrderPayload): Promise<CreatedOrder> => {
  const response = await fetch(apiUrl('/api/orders'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).catch(() => {
    throw new OrderRequestError(CREATE_ORDER_ERROR)
  })

  if (!response.ok) throw await readOrderError(response)

  return response.json() as Promise<CreatedOrder>
}

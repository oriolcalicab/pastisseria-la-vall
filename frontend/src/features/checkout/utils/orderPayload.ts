import type { CartLine } from '../../cart/types/cart'
import type { DeliveryMethod, OrderPayload, ShippingAddress } from '../types/checkout'

type OrderPayloadInput = {
  idempotencyKey: string
  deliveryDate: string
  method: DeliveryMethod
  pickupPointId: number | null
  address: ShippingAddress
  lines: CartLine[]
}

export const buildOrderPayload = ({
  idempotencyKey,
  deliveryDate,
  method,
  pickupPointId,
  address,
  lines,
}: OrderPayloadInput): OrderPayload => ({
  idempotencyKey,
  deliveryDate,
  deliveryMethod: method,
  ...(method === 'pickup' && pickupPointId !== null ? { pickupPointId } : {}),
  ...(method === 'delivery' ? { shippingAddress: address } : {}),
  lines: lines.map(({ variantId, quantity, priceCents }) => ({ variantId, quantity, priceCents })),
})

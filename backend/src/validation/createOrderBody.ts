import type { CreateOrderRequest, OrderDelivery } from '../types/order.js'
import { parseCartValidateBody } from './cartValidateBody.js'
import { parseIdParam } from './idParam.js'
import { isRealDate } from './realDate.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const BARCELONA_POSTAL_CODE = /^080\d{2}$/
const MIN_ADDRESS_LENGTH = 5
const MAX_ADDRESS_LENGTH = 200
const MIN_CITY_LENGTH = 2
const MAX_CITY_LENGTH = 100

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const fail = (error: string) => ({ ok: false as const, error })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseText = (value: unknown, min: number, max: number): string | null => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()

  return trimmed.length >= min && trimmed.length <= max ? trimmed : null
}

const parseDelivery = (body: Record<string, unknown>): Result<OrderDelivery> => {
  if (body.deliveryMethod === 'pickup') {
    const pickupPointId = parseIdParam(String(body.pickupPointId))

    if (!Number.isInteger(body.pickupPointId) || pickupPointId === null) {
      return fail('Tria un punt de recollida')
    }

    return { ok: true, data: { method: 'pickup', pickupPointId } }
  }

  if (body.deliveryMethod === 'delivery') {
    const shipping = isRecord(body.shippingAddress) ? body.shippingAddress : {}
    const address = parseText(shipping.address, MIN_ADDRESS_LENGTH, MAX_ADDRESS_LENGTH)
    const city = parseText(shipping.city, MIN_CITY_LENGTH, MAX_CITY_LENGTH)
    const postalCode = typeof shipping.postalCode === 'string' ? shipping.postalCode.trim() : ''

    if (!address || !city) return fail("L'adreça de lliurament no és vàlida")
    if (!BARCELONA_POSTAL_CODE.test(postalCode)) {
      return fail('El codi postal ha de ser de Barcelona (080xx)')
    }

    return { ok: true, data: { method: 'delivery', address: { address, city, postalCode } } }
  }

  return fail('El mètode de lliurament no és vàlid')
}

export const parseCreateOrderBody = (body: unknown): Result<CreateOrderRequest> => {
  if (!isRecord(body)) return fail('La comanda no és vàlida')

  const { idempotencyKey, deliveryDate } = body

  if (typeof idempotencyKey !== 'string' || !UUID_PATTERN.test(idempotencyKey)) {
    return fail('La comanda no és vàlida')
  }

  if (!isRealDate(deliveryDate)) return fail('La data de lliurament no és vàlida')

  const delivery = parseDelivery(body)

  if (!delivery.ok) return delivery

  const lines = parseCartValidateBody({ lines: body.lines })

  if (!lines || lines.length === 0) return fail('Els productes de la comanda no són vàlids')

  return { ok: true, data: { idempotencyKey, deliveryDate, delivery: delivery.data, lines } }
}

import { describe, expect, it } from 'vitest'
import { parseCreateOrderBody } from './createOrderBody.js'

const idempotencyKey = '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12'
const line = { variantId: 12, quantity: 2, priceCents: 3900 }

const pickupBody = (overrides: object = {}) => ({
  idempotencyKey,
  deliveryDate: '2026-11-12',
  deliveryMethod: 'pickup',
  pickupPointId: 2,
  lines: [line],
  ...overrides,
})

const deliveryBody = (overrides: object = {}) => ({
  idempotencyKey,
  deliveryDate: '2026-11-12',
  deliveryMethod: 'delivery',
  shippingAddress: { address: ' Carrer de Mallorca, 120 ', city: 'Barcelona', postalCode: '08036' },
  lines: [line],
  ...overrides,
})

describe('parseCreateOrderBody', () => {
  it('returns a pickup order', () => {
    // Given a valid pickup order that also tries to set the user and the total
    const body = pickupBody({ userId: 99, totalCents: 1 })

    // When the body is parsed
    // Then only the known fields are returned
    expect(parseCreateOrderBody(body)).toEqual({
      ok: true,
      data: {
        idempotencyKey,
        deliveryDate: '2026-11-12',
        delivery: { method: 'pickup', pickupPointId: 2 },
        lines: [line],
      },
    })
  })

  it('returns a home delivery with a clean address', () => {
    // Given a valid home delivery with spaces in the address
    // When the body is parsed
    // Then the address is trimmed
    expect(parseCreateOrderBody(deliveryBody())).toMatchObject({
      ok: true,
      data: {
        delivery: {
          method: 'delivery',
          address: { address: 'Carrer de Mallorca, 120', city: 'Barcelona', postalCode: '08036' },
        },
      },
    })
  })

  it.each([
    [
      'without idempotency key',
      pickupBody({ idempotencyKey: undefined }),
      'La comanda no és vàlida',
    ],
    [
      'with an idempotency key that is not a UUID',
      pickupBody({ idempotencyKey: 'abc' }),
      'La comanda no és vàlida',
    ],
    [
      'with a date that does not exist',
      pickupBody({ deliveryDate: '2026-02-30' }),
      'La data de lliurament no és vàlida',
    ],
    [
      'with a date in another format',
      pickupBody({ deliveryDate: '12/11/2026' }),
      'La data de lliurament no és vàlida',
    ],
    [
      'with an unknown method',
      pickupBody({ deliveryMethod: 'drone' }),
      'El mètode de lliurament no és vàlid',
    ],
    [
      'a pickup without point',
      pickupBody({ pickupPointId: undefined }),
      'Tria un punt de recollida',
    ],
    [
      'a pickup with the point as text',
      pickupBody({ pickupPointId: '2' }),
      'Tria un punt de recollida',
    ],
    [
      'a home delivery without address',
      deliveryBody({ shippingAddress: undefined }),
      "L'adreça de lliurament no és vàlida",
    ],
    [
      'a home delivery outside Barcelona',
      deliveryBody({
        shippingAddress: { address: 'Carrer Major, 1', city: 'Madrid', postalCode: '28001' },
      }),
      'El codi postal ha de ser de Barcelona (080xx)',
    ],
    ['without products', pickupBody({ lines: [] }), 'Els productes de la comanda no són vàlids'],
    [
      'with a wrong quantity',
      pickupBody({ lines: [{ ...line, quantity: 0 }] }),
      'Els productes de la comanda no són vàlids',
    ],
  ])('rejects an order %s', (_case, body, error) => {
    // Given an invalid order
    // When the body is parsed
    // Then it is rejected with the reason
    expect(parseCreateOrderBody(body)).toEqual({ ok: false, error })
  })
})

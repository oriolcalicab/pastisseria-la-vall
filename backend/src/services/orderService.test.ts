import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import type { CreateOrderRequest } from '../types/order.js'
import { findCartVariants } from './cartService.js'
import { getDeliveryDates } from './deliveryService.js'
import { createOrder } from './orderService.js'
import { getShippingFeeCents } from './settingsService.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: { pickupPoint: { findFirst: vi.fn() }, order: { create: vi.fn() } },
}))
vi.mock('./cartService.js', () => ({ findCartVariants: vi.fn() }))
vi.mock('./deliveryService.js', () => ({ getDeliveryDates: vi.fn() }))
vi.mock('./settingsService.js', () => ({ getShippingFeeCents: vi.fn() }))

const now = new Date('2026-11-06T10:00:00Z')

const variant = {
  id: 12,
  name: '6 racions',
  priceCents: 3900,
  stock: 5,
  isActive: true,
  product: { id: 7, name: 'Pastís de xocolata', imageUrl: null, isActive: true },
}

const pickupRequest: CreateOrderRequest = {
  idempotencyKey: '3f2b7c1e-8a4d-4b6f-9c2e-1d5a7b9e0f12',
  deliveryDate: '2026-11-12',
  delivery: { method: 'pickup', pickupPointId: 2 },
  lines: [{ variantId: 12, quantity: 2, priceCents: 3900 }],
}

const deliveryRequest: CreateOrderRequest = {
  ...pickupRequest,
  delivery: {
    method: 'delivery',
    address: { address: 'Carrer de Mallorca, 120', city: 'Barcelona', postalCode: '08036' },
  },
}

describe('createOrder', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getDeliveryDates).mockResolvedValue({
      month: '2026-11',
      days: [{ date: '2026-11-12', available: true, reason: null }],
    })
    vi.mocked(prisma.pickupPoint.findFirst).mockResolvedValue({ id: 2 } as never)
    vi.mocked(findCartVariants).mockResolvedValue([variant] as never)
    vi.mocked(getShippingFeeCents).mockResolvedValue(500)
    vi.mocked(prisma.order.create).mockResolvedValue({
      id: 1,
      orderNumber: 'LV-261106-4F2A9C',
      status: 'pending',
      totalCents: 7800,
    } as never)
  })

  it('creates a pickup order for the user with the prices of the database', async () => {
    // Given an available date, an active point and the same prices
    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then it is saved for that user with the lines, the totals and the first status
    expect(result).toMatchObject({ ok: true, order: { orderNumber: 'LV-261106-4F2A9C' } })
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 5,
          deliveryMethod: 'pickup',
          deliveryDate: new Date('2026-11-12T00:00:00Z'),
          pickupPointId: 2,
          subtotalCents: 7800,
          shippingCents: 0,
          totalCents: 7800,
          items: {
            create: [
              {
                variantId: 12,
                productName: 'Pastís de xocolata',
                variantName: '6 racions',
                unitPriceCents: 3900,
                quantity: 2,
                lineTotalCents: 7800,
              },
            ],
          },
          statusHistory: { create: { toStatus: 'pending', changedBy: 5 } },
        }),
      }),
    )
  })

  it('saves the address and the shipping of a home delivery', async () => {
    // Given a home delivery
    // When the order is created
    await createOrder(5, deliveryRequest, now)

    // Then the address and the shipping are saved
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          deliveryMethod: 'delivery',
          shippingAddress: 'Carrer de Mallorca, 120',
          shippingCity: 'Barcelona',
          shippingPostalCode: '08036',
          shippingCents: 500,
          totalCents: 8300,
        }),
      }),
    )
    expect(prisma.pickupPoint.findFirst).not.toHaveBeenCalled()
  })

  it('does not create the order when the date is no longer available', async () => {
    // Given a day that became full
    vi.mocked(getDeliveryDates).mockResolvedValue({
      month: '2026-11',
      days: [{ date: '2026-11-12', available: false, reason: 'full' }],
    })

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then nothing is saved
    expect(result).toEqual({ ok: false, reason: 'date_unavailable' })
    expect(prisma.order.create).not.toHaveBeenCalled()
  })

  it('does not create the order when the pickup point is not active', async () => {
    // Given a pickup point that was deactivated
    vi.mocked(prisma.pickupPoint.findFirst).mockResolvedValue(null)

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then nothing is saved
    expect(result).toEqual({ ok: false, reason: 'pickup_point_unavailable' })
    expect(prisma.order.create).not.toHaveBeenCalled()
  })

  it('does not create the order when a price changed', async () => {
    // Given a price that changed since the customer saw it
    vi.mocked(findCartVariants).mockResolvedValue([{ ...variant, priceCents: 4200 }] as never)

    // When the order is created
    const result = await createOrder(5, pickupRequest, now)

    // Then nothing is saved and the customer gets the warning
    expect(result).toEqual({
      ok: false,
      reason: 'cart_changed',
      warnings: [{ variantId: 12, type: 'price_changed' }],
    })
    expect(prisma.order.create).not.toHaveBeenCalled()
  })
})

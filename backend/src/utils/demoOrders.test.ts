import { describe, expect, it } from 'vitest'
import { buildDemoOrders, DEMO_KEY_PREFIX } from './demoOrders.js'

const catalog = {
  variants: [
    { id: 1, productName: 'Pastís de xocolata', variantName: '6 racions', priceCents: 3900 },
    { id: 2, productName: 'Cupcakes de vainilla', variantName: 'Caixa de 4', priceCents: 1400 },
  ],
  pickupPointIds: [10, 11],
  customerIds: [100, 101, 102],
  shippingFeeCents: 500,
}

const today = '2026-11-12'
const orders = buildDemoOrders(catalog, today)
const dayOf = (order: { deliveryDate: Date }) => order.deliveryDate.toISOString().slice(0, 10)

describe('buildDemoOrders', () => {
  it('always builds the same orders, marked as demo', () => {
    expect(buildDemoOrders(catalog, today)).toEqual(orders)
    expect(orders.length).toBeGreaterThan(20)
    expect(orders.every((order) => order.idempotencyKey.startsWith(DEMO_KEY_PREFIX))).toBe(true)
    expect(new Set(orders.map((order) => order.orderNumber)).size).toBe(orders.length)
  })

  it('delivers the past orders, has ready orders today and pending ones ahead', () => {
    const past = orders.filter((order) => dayOf(order) < today)
    const future = orders.filter((order) => dayOf(order) > today)

    expect(past.every((order) => ['delivered', 'cancelled'].includes(order.status))).toBe(true)
    expect(orders.filter((order) => dayOf(order) === today).map((order) => order.status)).toEqual([
      'ready',
      'ready',
    ])
    expect(future.every((order) => ['pending', 'preparing'].includes(order.status))).toBe(true)
  })

  it('never delivers on Sunday and leaves room in the coming days', () => {
    expect(orders.some((order) => order.deliveryDate.getUTCDay() === 0)).toBe(false)

    const perDay = new Map<string, number>()
    orders
      .filter((order) => dayOf(order) > today)
      .forEach((order) => perDay.set(dayOf(order), (perDay.get(dayOf(order)) ?? 0) + 1))
    expect(Math.max(...perDay.values())).toBeLessThanOrEqual(2)
  })

  it('adds up the lines and the shipping of each order', () => {
    for (const order of orders) {
      const lines = order.items.reduce((total, item) => total + item.lineTotalCents, 0)

      expect(order.subtotalCents).toBe(lines)
      expect(order.totalCents).toBe(order.subtotalCents + order.shippingCents)
      expect(order.createdAt.getTime()).toBeLessThan(order.deliveryDate.getTime())
    }
  })

  it('has a pickup point or an address, never both', () => {
    for (const order of orders) {
      if (order.deliveryMethod === 'pickup') {
        expect(order.pickupPointId).not.toBeNull()
        expect(order.shippingAddress).toBeNull()
        expect(order.shippingCents).toBe(0)
      } else {
        expect(order.pickupPointId).toBeNull()
        expect(order.shippingAddress).not.toBeNull()
        expect(order.shippingCents).toBe(500)
      }
    }
  })
})

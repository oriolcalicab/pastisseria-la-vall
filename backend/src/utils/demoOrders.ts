import type { DeliveryMethod, OrderStatus } from '../generated/prisma/enums.js'

export const DEMO_KEY_PREFIX = 'demo-'

const DAY_MS = 24 * 60 * 60 * 1000
const DAYS_BACK = 30
const DAYS_AHEAD = 10
const SUNDAY = 0

const demoAddresses = [
  { address: 'Carrer de Verdi, 12', postalCode: '08012' },
  { address: 'Carrer de Mallorca, 230', postalCode: '08008' },
  { address: 'Carrer del Comte Borrell, 75', postalCode: '08015' },
  { address: 'Carrer de Pere IV, 110', postalCode: '08005' },
]

export type DemoVariant = {
  id: number
  productName: string
  variantName: string
  priceCents: number
}

export type DemoCatalog = {
  variants: DemoVariant[]
  pickupPointIds: number[]
  customerIds: number[]
  shippingFeeCents: number
}

export type DemoOrderItem = {
  variantId: number
  productName: string
  variantName: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export type DemoOrder = {
  orderNumber: string
  idempotencyKey: string
  userId: number
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  deliveryDate: Date
  pickupPointId: number | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingPostalCode: string | null
  subtotalCents: number
  shippingCents: number
  totalCents: number
  createdAt: Date
  items: DemoOrderItem[]
}

export type RandomSource = () => number

export const seededRandom = (seed: number): RandomSource => {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <Item>(items: Item[], random: RandomSource): Item =>
  items[Math.floor(random() * items.length)]

const between = (min: number, max: number, random: RandomSource) =>
  min + Math.floor(random() * (max - min + 1))

const ordersForDay = (offset: number, random: RandomSource) => {
  if (offset < 0) return between(0, 3, random)
  if (offset === 0) return 2
  if (offset <= 3) return between(1, 2, random)

  return between(0, 1, random)
}

const statusForDay = (offset: number, random: RandomSource): OrderStatus => {
  if (offset < 0) return random() < 0.12 ? 'cancelled' : 'delivered'
  if (offset === 0) return 'ready'
  if (offset <= 2) return random() < 0.5 ? 'preparing' : 'pending'

  return 'pending'
}

const buildItems = (variants: DemoVariant[], random: RandomSource): DemoOrderItem[] => {
  const lineCount = random() < 0.7 ? 1 : 2

  return Array.from({ length: lineCount }, () => {
    const variant = pick(variants, random)
    const quantity = random() < 0.75 ? 1 : 2

    return {
      variantId: variant.id,
      productName: variant.productName,
      variantName: variant.variantName,
      unitPriceCents: variant.priceCents,
      quantity,
      lineTotalCents: variant.priceCents * quantity,
    }
  })
}

export const buildDemoOrders = (
  catalog: DemoCatalog,
  today: string,
  random: RandomSource = seededRandom(2026),
): DemoOrder[] => {
  const todayMs = Date.parse(`${today}T00:00:00Z`)
  const orders: DemoOrder[] = []

  for (let offset = -DAYS_BACK; offset <= DAYS_AHEAD; offset += 1) {
    const deliveryDate = new Date(todayMs + offset * DAY_MS)

    if (deliveryDate.getUTCDay() === SUNDAY) continue

    const count = ordersForDay(offset, random)

    for (let index = 0; index < count; index += 1) {
      const number = orders.length + 1
      const items = buildItems(catalog.variants, random)
      const subtotalCents = items.reduce((total, item) => total + item.lineTotalCents, 0)
      const isPickup = random() < 0.6
      const address = pick(demoAddresses, random)
      const shippingCents = isPickup ? 0 : catalog.shippingFeeCents
      const createdAt = new Date(deliveryDate.getTime() - between(2, 4, random) * DAY_MS)
      createdAt.setUTCHours(between(8, 19, random), between(0, 59, random))

      orders.push({
        orderNumber: `LV-${deliveryDate.toISOString().slice(2, 10).replaceAll('-', '')}-D${String(number).padStart(5, '0')}`,
        idempotencyKey: `${DEMO_KEY_PREFIX}${number}`,
        userId: pick(catalog.customerIds, random),
        status: statusForDay(offset, random),
        deliveryMethod: isPickup ? 'pickup' : 'delivery',
        deliveryDate,
        pickupPointId: isPickup ? pick(catalog.pickupPointIds, random) : null,
        shippingAddress: isPickup ? null : address.address,
        shippingCity: isPickup ? null : 'Barcelona',
        shippingPostalCode: isPickup ? null : address.postalCode,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        createdAt,
        items,
      })
    }
  }

  return orders
}

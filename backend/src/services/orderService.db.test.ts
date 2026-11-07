import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import type { RequestedCartLine } from '../types/cart.js'
import type { CreateOrderRequest } from '../types/order.js'
import { findCartVariants } from './cartService.js'
import { createOrder } from './orderService.js'

if (process.env.TEST_DATABASE !== 'true') {
  throw new Error('Database tests must run with "pnpm test:db" against the test branch')
}

vi.mock('./cartService.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('./cartService.js')>()

  return { ...original, findCartVariants: vi.fn(original.findCartVariants) }
})

const MAX_ORDERS_KEY = 'max_orders_per_day'
const NOW = new Date('2030-01-07T09:00:00Z')
const suffix = `t076-${Date.now()}`

let categoryId: number
let productId: number
let variantA: { id: number }
let variantB: { id: number }
let userIds: number[]
let originalMaxOrders: string | null

const deliveryRequest = (deliveryDate: string, lines: RequestedCartLine[]): CreateOrderRequest => ({
  idempotencyKey: randomUUID(),
  deliveryDate,
  delivery: {
    method: 'delivery',
    address: { address: 'Carrer de Prova, 1', city: 'Barcelona', postalCode: '08001' },
  },
  lines,
})

const getStock = async (id: number) =>
  (await prisma.productVariant.findUniqueOrThrow({ where: { id } })).stock

describe('createOrder against the test database', () => {
  beforeAll(async () => {
    const category = await prisma.category.create({ data: { name: 'Test T-076', slug: suffix } })
    const product = await prisma.product.create({
      data: {
        categoryId: category.id,
        name: `Producte ${suffix}`,
        description: 'Producte de prova',
        variants: {
          create: [
            { name: 'A', priceCents: 1000, stock: 5, sortOrder: 0 },
            { name: 'B', priceCents: 2000, stock: 0, sortOrder: 1 },
          ],
        },
      },
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    })
    const users = await Promise.all(
      [1, 2].map((number) =>
        prisma.user.create({
          data: {
            firebaseUid: `${suffix}-${number}`,
            email: `${suffix}-${number}@test.local`,
            name: `Usuari ${number}`,
          },
        }),
      ),
    )
    const maxOrders = await prisma.setting.findUnique({ where: { key: MAX_ORDERS_KEY } })

    categoryId = category.id
    productId = product.id
    variantA = product.variants[0]!
    variantB = product.variants[1]!
    userIds = users.map((user) => user.id)
    originalMaxOrders = maxOrders?.value ?? null

    await prisma.setting.upsert({
      where: { key: MAX_ORDERS_KEY },
      update: { value: '1' },
      create: { key: MAX_ORDERS_KEY, value: '1' },
    })
  })

  afterAll(async () => {
    const orders = await prisma.order.findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    })
    const orderIds = orders.map((order) => order.id)

    await prisma.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } })
    await prisma.productVariant.deleteMany({ where: { productId } })
    await prisma.product.delete({ where: { id: productId } })
    await prisma.category.delete({ where: { id: categoryId } })
    await prisma.user.deleteMany({ where: { id: { in: userIds } } })

    if (originalMaxOrders === null) {
      await prisma.setting.delete({ where: { key: MAX_ORDERS_KEY } })
    } else {
      await prisma.setting.update({
        where: { key: MAX_ORDERS_KEY },
        data: { value: originalMaxOrders },
      })
    }

    await prisma.$disconnect()
  })

  it('saves nothing when one line can not be taken from the stock', async () => {
    // Given variant B looks available in the first check but has no stock when the order is saved
    const variants = await findCartVariants([variantA.id, variantB.id])
    vi.mocked(findCartVariants).mockResolvedValueOnce(
      variants.map((variant) => (variant.id === variantB.id ? { ...variant, stock: 5 } : variant)),
    )

    // When an order with A and B is created
    const result = await createOrder(
      userIds[0]!,
      deliveryRequest('2030-01-10', [
        { variantId: variantA.id, quantity: 2, priceCents: 1000 },
        { variantId: variantB.id, quantity: 1, priceCents: 2000 },
      ]),
      NOW,
    )

    // Then the order is rejected, the stock of A is put back and no order is saved
    expect(result).toEqual({
      ok: false,
      reason: 'cart_changed',
      warnings: [{ variantId: variantB.id, type: 'out_of_stock' }],
    })
    expect(await getStock(variantA.id)).toBe(5)
    expect(await prisma.order.count({ where: { userId: { in: userIds } } })).toBe(0)
  })

  it('only saves one order when two customers want the last place of the day at the same time', async () => {
    // Given a day with only one place
    const lines = [{ variantId: variantA.id, quantity: 1, priceCents: 1000 }]

    // When two customers send an order for that day at the same time
    const results = await Promise.all([
      createOrder(userIds[0]!, deliveryRequest('2030-01-11', lines), NOW),
      createOrder(userIds[1]!, deliveryRequest('2030-01-11', lines), NOW),
    ])

    // Then only one order is saved and the other customer is told the day is no longer available
    expect(results.filter((result) => result.ok)).toHaveLength(1)
    expect(results.filter((result) => !result.ok)).toEqual([
      { ok: false, reason: 'date_unavailable' },
    ])
    expect(
      await prisma.order.count({
        where: { userId: { in: userIds }, deliveryDate: new Date('2030-01-11T00:00:00Z') },
      }),
    ).toBe(1)
    expect(await getStock(variantA.id)).toBe(4)
  })
})

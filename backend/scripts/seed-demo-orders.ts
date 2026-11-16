import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js'
import { getShippingFeeCents } from '../src/services/settingsService.js'
import { toDateKey } from '../src/utils/dateKey.js'
import { getMadridNowMs } from '../src/utils/deliveryDates.js'
import { buildDemoOrders, DEMO_KEY_PREFIX } from '../src/utils/demoOrders.js'

const DEMO_UID_PREFIX = 'demo-customer-'

const demoCustomers = [
  { name: 'Anna Puig', email: 'anna.puig@demo.test' },
  { name: 'Marc Soler', email: 'marc.soler@demo.test' },
  { name: 'Laia Vidal', email: 'laia.vidal@demo.test' },
  { name: 'Jordi Roca', email: 'jordi.roca@demo.test' },
]

const removeDemoData = async () => {
  const demoOrders = await prisma.order.findMany({
    where: { idempotencyKey: { startsWith: DEMO_KEY_PREFIX } },
    select: { id: true },
  })
  const orderIds = demoOrders.map((order) => order.id)

  await prisma.$transaction([
    prisma.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } }),
    prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
    prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
    prisma.user.deleteMany({ where: { firebaseUid: { startsWith: DEMO_UID_PREFIX } } }),
  ])

  return orderIds.length
}

const createDemoData = async () => {
  const customers = await Promise.all(
    demoCustomers.map((customer, index) =>
      prisma.user.create({
        data: { ...customer, firebaseUid: `${DEMO_UID_PREFIX}${index + 1}`, role: 'customer' },
      }),
    ),
  )

  const variants = await prisma.productVariant.findMany({
    where: { isActive: true, product: { isActive: true } },
    select: { id: true, name: true, priceCents: true, product: { select: { name: true } } },
  })
  const pickupPoints = await prisma.pickupPoint.findMany({
    where: { isActive: true },
    select: { id: true },
  })

  if (variants.length === 0 || pickupPoints.length === 0) {
    throw new Error('Cal tenir productes i punts de recollida actius: passa abans el seed normal')
  }

  const orders = buildDemoOrders(
    {
      variants: variants.map((variant) => ({
        id: variant.id,
        productName: variant.product.name,
        variantName: variant.name,
        priceCents: variant.priceCents,
      })),
      pickupPointIds: pickupPoints.map((point) => point.id),
      customerIds: customers.map((customer) => customer.id),
      shippingFeeCents: await getShippingFeeCents(),
    },
    toDateKey(new Date(getMadridNowMs(new Date()))),
  )

  for (const { items, ...order } of orders) {
    await prisma.order.create({ data: { ...order, items: { create: items } } })
  }

  return orders.length
}

const main = async () => {
  const removed = await removeDemoData()
  console.log(`Comandes de mostra esborrades: ${removed}`)

  if (process.argv.includes('--remove')) return

  const created = await createDemoData()
  console.log(`Comandes de mostra creades: ${created}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

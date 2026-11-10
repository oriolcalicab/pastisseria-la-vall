import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ---------- Dades ----------
const categories = [
  { name: 'Pastissos', slug: 'pastissos' },
  { name: 'Cupcakes', slug: 'cupcakes' },
]

const cakeSizes = [
  { name: '6 racions', priceCents: 3900 },
  { name: '10 racions', priceCents: 4900 },
  { name: '14 racions', priceCents: 6500 },
]

const cupcakeBoxes = [
  { name: 'Caixa de 4', priceCents: 1400 },
  { name: 'Caixa de 6', priceCents: 2100 },
  { name: 'Caixa de 12', priceCents: 3800 },
]

const products = [
  {
    name: 'Pastís de xocolata',
    category: 'pastissos',
    description: 'Pastís de xocolata intensa amb ganache.',
    plantMilk: true,
    vegan: true,
    variants: cakeSizes,
  },
  {
    name: 'Cupcakes de vainilla',
    category: 'cupcakes',
    description: 'Cupcakes de vainilla amb crema de mantega.',
    plantMilk: true,
    vegan: true,
    variants: cupcakeBoxes,
  },
  {
    name: 'Pastís de llimona',
    category: 'pastissos',
    description: 'Pastís de llimona fresc i suau.',
    glutenFree: true,
    variants: cakeSizes,
  },
  {
    name: 'Cupcakes de cacau',
    category: 'cupcakes',
    description: 'Cupcakes de cacau amb crema de xocolata.',
    plantMilk: true,
    vegan: true,
    variants: cupcakeBoxes,
  },
  {
    name: 'Pastís de pastanaga',
    category: 'pastissos',
    description: 'Pastís de pastanaga amb crema de formatge.',
    plantMilk: true,
    variants: cakeSizes,
  },
  {
    name: "Pastís d'ametlla",
    category: 'pastissos',
    description: "Pastís d'ametlla, sense farina de blat.",
    glutenFree: true,
    variants: cakeSizes,
  },
  {
    name: 'Cupcakes de cafè',
    category: 'cupcakes',
    description: 'Cupcakes de cafè amb crema suau.',
    plantMilk: true,
    variants: cupcakeBoxes,
  },
  {
    name: 'Cupcakes de coco',
    category: 'cupcakes',
    description: 'Cupcakes de coco sense gluten.',
    glutenFree: true,
    vegan: true,
    active: false,
    variants: cupcakeBoxes,
  },
]

// Adreces i coordenades aproximades: revisa-les abans de la lliurada.
const pickupPoints = [
  {
    name: 'La Vall · Gràcia',
    address: 'Carrer de Torrijos, 24',
    city: 'Barcelona',
    latitude: 41.4005,
    longitude: 2.1589,
    openingHours: 'De dt. a ds., de 10 a 19 h',
  },
  {
    name: 'La Vall · Eixample',
    address: 'Carrer de Girona, 84',
    city: 'Barcelona',
    latitude: 41.3965,
    longitude: 2.1675,
    openingHours: 'De dt. a ds., de 9 a 19 h',
  },
  {
    name: 'La Vall · Sant Antoni',
    address: 'Carrer del Parlament, 31',
    city: 'Barcelona',
    latitude: 41.3775,
    longitude: 2.1595,
    openingHours: 'De dt. a ds., de 10 a 20 h',
  },
  {
    name: 'La Vall · Poblenou',
    address: 'Carrer de Llull, 148',
    city: 'Barcelona',
    latitude: 41.404,
    longitude: 2.199,
    openingHours: 'De dt. a ds., de 10 a 18 h',
  },
]

const settings = [
  { key: 'min_prep_hours', value: '48' },
  { key: 'max_orders_per_day', value: '5' },
  { key: 'shipping_fee_cents', value: '500' },
]

const closedDates = [
  { date: '2026-12-08', reason: 'La Immaculada' },
  { date: '2026-12-25', reason: 'Nadal' },
  { date: '2026-12-26', reason: 'Sant Esteve' },
  { date: '2027-01-01', reason: "Cap d'Any" },
  { date: '2027-01-06', reason: 'Reis' },
]

// ---------- Seed ----------
async function main() {
  // Categories
  const categoryIds: Record<string, number> = {}
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    })
    categoryIds[c.slug] = cat.id
  }

  // Productes i variants
  for (const p of products) {
    const data = {
      categoryId: categoryIds[p.category],
      name: p.name,
      description: p.description,
      isGlutenFree: p.glutenFree ?? false,
      isPlantMilk: p.plantMilk ?? false,
      isVegan: p.vegan ?? false,
      isActive: p.active ?? true,
    }
    const existing = await prisma.product.findFirst({ where: { name: p.name } })
    const product = existing
      ? await prisma.product.update({ where: { id: existing.id }, data })
      : await prisma.product.create({ data })

    for (const [i, v] of p.variants.entries()) {
      const existingVariant = await prisma.productVariant.findFirst({
        where: { productId: product.id, name: v.name },
      })
      if (existingVariant) {
        // No toquem l'stock d'una variant que ja existeix
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: {
            priceCents: v.priceCents,
            sortOrder: i,
            isActive: p.active ?? true,
          },
        })
      } else {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: v.name,
            priceCents: v.priceCents,
            stock: p.active === false ? 0 : 10,
            isActive: p.active ?? true,
            sortOrder: i,
          },
        })
      }
    }
  }

  // Punts de recollida
  for (const pp of pickupPoints) {
    const existing = await prisma.pickupPoint.findFirst({
      where: { name: pp.name },
    })
    if (existing) {
      await prisma.pickupPoint.update({ where: { id: existing.id }, data: pp })
    } else {
      await prisma.pickupPoint.create({ data: pp })
    }
  }

  // Settings
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // Festius
  for (const d of closedDates) {
    await prisma.closedDate.upsert({
      where: { date: new Date(d.date) },
      update: { reason: d.reason },
      create: { date: new Date(d.date), reason: d.reason },
    })
  }

  // Usuari admin (firebaseUid provisional, es vincula més endavant amb T-020)
  await prisma.user.upsert({
    where: { firebaseUid: 'seed-admin-placeholder' },
    update: {},
    create: {
      firebaseUid: 'seed-admin-placeholder',
      name: 'Admin La Vall',
      email: 'admin@pastisserialavall.cat',
      role: 'admin',
    },
  })

  console.log('Seed completat')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

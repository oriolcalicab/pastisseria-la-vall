import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../lib/prisma.js'
import { createProduct, listProducts, setProductActive, setVariantActive } from './productService.js'
import { NewProduct } from '../types/product.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
    category: { findUnique: vi.fn() },
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
    productVariant: { updateMany: vi.fn(), findUnique: vi.fn() },
  },
}))

describe('listProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.$transaction).mockImplementation(((queries: Promise<unknown>[]) =>
      Promise.all(queries)) as never)
    vi.mocked(prisma.product.findMany).mockResolvedValue([])
    vi.mocked(prisma.product.count).mockResolvedValue(25 as never)
  })

  it('lists all the products without search', async () => {
    // Given there is no search
    // When the second page of 20 is requested
    const result = await listProducts({ page: 2, pageSize: 20, search: undefined })

    // Then all the products are paginated and the accent search is not used
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {}, skip: 20, take: 20 }),
    )
    expect(result).toMatchObject({ page: 2, total: 25, totalPages: 2 })
  })

  it('searches ignoring accents and lists the matching products', async () => {
    // Given two products whose name matches "pastis"
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ id: 1 }, { id: 2 }] as never)

    // When the products are searched by "pastis"
    await listProducts({ page: 1, pageSize: 20, search: 'pastis' })

    // Then the search pattern is sent as a parameter and only those products are listed
    expect(vi.mocked(prisma.$queryRaw).mock.calls[0]).toContain('%pastis%')
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: [1, 2] } } }),
    )
    expect(prisma.product.count).toHaveBeenCalledWith({ where: { id: { in: [1, 2] } } })
  })

  it('returns no pages when there are no products', async () => {
    // Given there are no products
    vi.mocked(prisma.product.count).mockResolvedValue(0 as never)

    // When the first page is requested
    const result = await listProducts({ page: 1, pageSize: 20, search: undefined })

    // Then the page is empty and there are no pages
    expect(result).toMatchObject({ items: [], total: 0, totalPages: 0 })
  })

  it('returns an empty page when the search has no matches', async () => {
    // Given no product matches the search
    vi.mocked(prisma.$queryRaw).mockResolvedValue([] as never)
    vi.mocked(prisma.product.count).mockResolvedValue(0 as never)

    // When the products are searched by "zzz"
    const result = await listProducts({ page: 1, pageSize: 20, search: 'zzz' })

    // Then nothing matches and there are no pages
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: [] } } }),
    )
    expect(result).toMatchObject({ total: 0, totalPages: 0 })
  })
})

describe('createProduct', () => {
  const newProduct: NewProduct = {
    categoryId: 1,
    name: 'Pastís de maduixa',
    description: 'Bescuit amb nata i maduixes',
    allergens: null,
    isGlutenFree: false,
    isPlantMilk: false,
    isVegan: false,
    isActive: true,
    variants: [{ name: '6 racions', priceCents: 3900, stock: 5, sortOrder: 0 }],
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('does not create the product when the category does not exist', async () => {
    // Given the category does not exist
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)

    // When the product is created
    const result = await createProduct(newProduct)

    // Then nothing is created
    expect(result).toBeNull()
    expect(prisma.product.create).not.toHaveBeenCalled()
  })

  it('creates the product and its variants at once', async () => {
    // Given the category exists
    vi.mocked(prisma.category.findUnique).mockResolvedValue({ id: 1 } as never)
    vi.mocked(prisma.product.create).mockResolvedValue({ id: 10 } as never)

    // When the product is created
    const result = await createProduct(newProduct)

    // Then the variants are created inside the product and the product is returned
    const { variants, ...product } = newProduct
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: { ...product, variants: { create: variants } },
      include: { category: true, variants: { orderBy: { sortOrder: 'asc' } } },
    })
    expect(result).toEqual({ id: 10 })
  })
})

describe('setProductActive', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns null when the product does not exist', async () => {
    // Given no product with this id
    vi.mocked(prisma.product.updateMany).mockResolvedValue({ count: 0 })

    // When the product is deactivated
    const result = await setProductActive(99, false)

    // Then nothing is returned
    expect(result).toBeNull()
    expect(prisma.product.findUnique).not.toHaveBeenCalled()
  })

  it('changes the status and returns the product', async () => {
    // Given an existing product
    vi.mocked(prisma.product.updateMany).mockResolvedValue({ count: 1 })
    vi.mocked(prisma.product.findUnique).mockResolvedValue({ id: 7, isActive: false } as never)

    // When the product is deactivated
    const result = await setProductActive(7, false)

    // Then only isActive is changed and the product is returned
    expect(prisma.product.updateMany).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { isActive: false },
    })
    expect(result).toEqual({ id: 7, isActive: false })
  })
})

describe('setVariantActive', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('only changes the variant when it belongs to the product', async () => {
    // Given a variant
    vi.mocked(prisma.productVariant.updateMany).mockResolvedValue({ count: 1 })
    vi.mocked(prisma.productVariant.findUnique).mockResolvedValue({ id: 12, isActive: true } as never)

    // When the variant of the product is activated
    const result = await setVariantActive(7, 12, true)

    // Then the product is part of the condition and the variant is returned
    expect(prisma.productVariant.updateMany).toHaveBeenCalledWith({
      where: { id: 12, productId: 7 },
      data: { isActive: true },
    })
    expect(result).toEqual({ id: 12, isActive: true })
  })

  it('returns null when the variant is not of that product', async () => {
    // Given a variant that belongs to another product
    vi.mocked(prisma.productVariant.updateMany).mockResolvedValue({ count: 0 })

    // When it is changed through the wrong product
    const result = await setVariantActive(7, 12, false)

    // Then nothing is changed or returned
    expect(result).toBeNull()
    expect(prisma.productVariant.findUnique).not.toHaveBeenCalled()
  })
})
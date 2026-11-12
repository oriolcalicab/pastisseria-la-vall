import { Router } from 'express'
import type { Request, Response } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import {
  createProduct,
  getAdminProduct,
  listProducts,
  setProductActive,
  setVariantActive,
  updateProduct,
} from '../services/productService.js'
import { parseProductListQuery } from '../validation/productListQuery.js'
import { parseCreateProductBody, parseUpdateProductBody } from '../validation/createProductBody.js'
import { parseActiveBody } from '../validation/activeBody.js'
import { parseIdParam } from '../validation/idParam.js'
import adminOrderRouter from './adminOrderRoutes.js'
import adminStatsRouter from './adminStatsRoutes.js'

const handlePing = (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
}

const handleListProducts = async (req: Request, res: Response) => {
  const query = parseProductListQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Paràmetres de la llista no vàlids' })
    return
  }

  res.json(await listProducts(query))
}

const INVALID_ACTIVE_BODY = 'Cal enviar isActive amb true o false'

const handleSetProductActive = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id)
  const body = parseActiveBody(req.body)

  if (id === null) {
    res.status(400).json({ error: 'El producte no és vàlid' })
    return
  }

  if (!body) {
    res.status(400).json({ error: INVALID_ACTIVE_BODY })
    return
  }

  const product = await setProductActive(id, body.isActive)

  if (!product) {
    res.status(404).json({ error: 'El producte no existeix' })
    return
  }

  res.json(product)
}

const handleSetVariantActive = async (req: Request, res: Response) => {
  const productId = parseIdParam(req.params.productId)
  const variantId = parseIdParam(req.params.variantId)
  const body = parseActiveBody(req.body)

  if (productId === null || variantId === null) {
    res.status(400).json({ error: 'La variant no és vàlida' })
    return
  }

  if (!body) {
    res.status(400).json({ error: INVALID_ACTIVE_BODY })
    return
  }

  const variant = await setVariantActive(productId, variantId, body.isActive)

  if (!variant) {
    res.status(404).json({ error: 'La variant no existeix en aquest producte' })
    return
  }

  res.json(variant)
}

const handleCreateProduct = async (req: Request, res: Response) => {
  const body = parseCreateProductBody(req.body)

  if (!body.ok) {
    res.status(400).json({ error: body.error })
    return
  }

  const product = await createProduct(body.data)

  if (!product) {
    res.status(400).json({ error: 'La categoria no existeix' })
    return
  }

  res.status(201).json(product)
}

const handleGetProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'El producte no és vàlid' })
    return
  }

  const product = await getAdminProduct(id)

  if (!product) {
    res.status(404).json({ error: 'El producte no existeix' })
    return
  }

  res.json(product)
}

const updateErrors = {
  product_not_found: { status: 404, error: 'El producte no existeix' },
  category_not_found: { status: 400, error: 'La categoria no existeix' },
  variant_not_found: { status: 400, error: "Alguna variant no és d'aquest producte" },
}

const handleUpdateProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'El producte no és vàlid' })
    return
  }

  const body = parseUpdateProductBody(req.body)

  if (!body.ok) {
    res.status(400).json({ error: body.error })
    return
  }

  const result = await updateProduct(id, body.data)

  if (!result.ok) {
    const { status, error } = updateErrors[result.reason]
    res.status(status).json({ error })
    return
  }

  res.json(result.product)
}

const adminRouter = Router()

adminRouter.use(adminOnly)
adminRouter.get('/ping', handlePing)
adminRouter.get('/products', handleListProducts)
adminRouter.get('/products/:id', handleGetProduct)
adminRouter.put('/products/:id', handleUpdateProduct)
adminRouter.post('/products', handleCreateProduct)
adminRouter.patch('/products/:id', handleSetProductActive)
adminRouter.patch('/products/:productId/variants/:variantId', handleSetVariantActive)
adminRouter.use('/orders', adminOrderRouter)
adminRouter.use('/stats', adminStatsRouter)

export default adminRouter

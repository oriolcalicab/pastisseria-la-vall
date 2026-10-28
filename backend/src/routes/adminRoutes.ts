import { Router } from 'express'
import type { Request, Response } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { listProducts, createProduct } from '../services/productService.js'
import { parseProductListQuery } from '../validation/productListQuery.js'
import { parseCreateProductBody } from '../validation/createProductBody.js'

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

const adminRouter = Router()

adminRouter.use(adminOnly)
adminRouter.get('/ping', handlePing)
adminRouter.get('/products', handleListProducts)
adminRouter.post('/products', handleCreateProduct)

export default adminRouter

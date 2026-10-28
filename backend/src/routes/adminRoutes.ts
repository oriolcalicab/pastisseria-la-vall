import { Router } from 'express'
import type { Request, Response } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { listProducts } from '../services/productService.js'
import { parseProductListQuery } from '../validation/productListQuery.js'

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

const adminRouter = Router()

adminRouter.use(adminOnly)
adminRouter.get('/ping', handlePing)
adminRouter.get('/products', handleListProducts)

export default adminRouter

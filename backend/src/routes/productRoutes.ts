import { Router } from 'express'
import type { Request, Response } from 'express'
import { listPublicProducts } from '../services/productService.js'
import { parsePublicProductQuery } from '../validation/publicProductQuery.js'

const handleListProducts = async (req: Request, res: Response) => {
  const query = parsePublicProductQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Paràmetres de la llista no vàlids' })
    return
  }

  res.json(await listPublicProducts(query))
}

const productRouter = Router()

productRouter.get('/', handleListProducts)

export default productRouter
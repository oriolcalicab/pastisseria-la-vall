import { Router } from 'express'
import type { Request, Response } from 'express'
import { getPublicProduct, listPublicProducts } from '../services/productService.js'
import { parseIdParam } from '../validation/idParam.js'
import { parsePublicProductQuery } from '../validation/publicProductQuery.js'

const handleListProducts = async (req: Request, res: Response) => {
  const query = parsePublicProductQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Paràmetres de la llista no vàlids' })
    return
  }

  res.json(await listPublicProducts(query))
}

const handleGetProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'El producte no és vàlid' })
    return
  }

  const product = await getPublicProduct(id)

  if (!product) {
    res.status(404).json({ error: 'El producte no existeix' })
    return
  }

  res.json(product)
}

const productRouter = Router()

productRouter.get('/', handleListProducts)
productRouter.get('/:id', handleGetProduct)

export default productRouter
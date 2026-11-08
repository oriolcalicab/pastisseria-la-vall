import { Router } from 'express'
import type { Request, Response } from 'express'
import { getAdminOrder, listAdminOrders } from '../services/adminOrderService.js'
import { parseAdminOrderListQuery } from '../validation/adminOrderListQuery.js'
import { parseIdParam } from '../validation/idParam.js'

const handleListOrders = async (req: Request, res: Response) => {
  const query = parseAdminOrderListQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Paràmetres de la llista no vàlids' })
    return
  }

  res.json(await listAdminOrders(query))
}

const handleGetOrder = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'La comanda no és vàlida' })
    return
  }

  const order = await getAdminOrder(id)

  if (!order) {
    res.status(404).json({ error: 'La comanda no existeix' })
    return
  }

  res.json(order)
}

const adminOrderRouter = Router()

adminOrderRouter.get('/', handleListOrders)
adminOrderRouter.get('/:id', handleGetOrder)

export default adminOrderRouter

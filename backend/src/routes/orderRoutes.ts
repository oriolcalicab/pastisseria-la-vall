import { Router } from 'express'
import type { Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { parseCreateOrderBody } from '../validation/createOrderBody.js'
import { createOrder, getCustomerOrder, listCustomerOrders } from '../services/orderService.js'
import { parseIdParam } from '../validation/idParam.js'

const conflictMessages = {
  date_unavailable: 'La data de lliurament ja no està disponible',
  pickup_point_unavailable: 'El punt de recollida ja no està disponible',
  cart_changed: 'Alguns productes han canviat. Revisa el carretó',
}

const handleCreateOrder = async (req: Request, res: Response) => {
  const user = res.locals.user

  if (!user) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  const body = parseCreateOrderBody(req.body)

  if (!body.ok) {
    res.status(400).json({ error: body.error })
    return
  }

  const result = await createOrder(user.id, body.data, new Date())

  if (!result.ok) {
    res.status(409).json({
      error: conflictMessages[result.reason],
      reason: result.reason,
      ...(result.reason === 'cart_changed' ? { warnings: result.warnings } : {}),
    })
    return
  }

  res.status(result.isNew ? 201 : 200).json(result.order)
}

const handleListOrders = async (_req: Request, res: Response) => {
  const user = res.locals.user

  if (!user) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  res.json(await listCustomerOrders(user.id))
}

const handleGetOrder = async (req: Request, res: Response) => {
  const user = res.locals.user

  if (!user) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'La comanda no és vàlida' })
    return
  }

  const order = await getCustomerOrder(user.id, id)

  if (!order) {
    res.status(404).json({ error: 'La comanda no existeix' })
    return
  }

  res.json(order)
}

const orderRouter = Router()

orderRouter.post('/', requireAuth, handleCreateOrder)
orderRouter.get('/', requireAuth, handleListOrders)
orderRouter.get('/:id', requireAuth, handleGetOrder)

export default orderRouter

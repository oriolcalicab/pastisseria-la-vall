import { Router } from 'express'
import type { Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createOrder } from '../services/orderService.js'
import { parseCreateOrderBody } from '../validation/createOrderBody.js'

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

const orderRouter = Router()

orderRouter.post('/', requireAuth, handleCreateOrder)

export default orderRouter

import { Router } from 'express'
import type { Request, Response } from 'express'
import {
  getAdminOrder,
  listAdminOrders,
  changeOrderStatus,
  listCalendarOrders,
} from '../services/adminOrderService.js'
import { parseCalendarQuery } from '../validation/calendarQuery.js'
import { parseStatusBody } from '../validation/statusBody.js'
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

const handleCalendar = async (req: Request, res: Response) => {
  const query = parseCalendarQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Cal enviar un rang de dates vàlid (from i to, màxim 62 dies)' })
    return
  }

  res.json(await listCalendarOrders(query))
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

const handleChangeStatus = async (req: Request, res: Response) => {
  const admin = res.locals.user

  if (!admin) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  const id = parseIdParam(req.params.id)

  if (id === null) {
    res.status(400).json({ error: 'La comanda no és vàlida' })
    return
  }

  const body = parseStatusBody(req.body)

  if (!body) {
    res.status(400).json({ error: 'Cal enviar un estat vàlid' })
    return
  }

  const result = await changeOrderStatus(id, body.status, admin.id)

  if (!result.ok && result.reason === 'not_found') {
    res.status(404).json({ error: 'La comanda no existeix' })
    return
  }

  if (!result.ok) {
    res.status(409).json({
      error: 'La comanda no pot passar a aquest estat',
      from: result.from,
      to: body.status,
    })
    return
  }

  res.json(result.order)
}

const adminOrderRouter = Router()

adminOrderRouter.get('/', handleListOrders)
adminOrderRouter.get('/calendar', handleCalendar)
adminOrderRouter.get('/:id', handleGetOrder)
adminOrderRouter.patch('/:id/status', handleChangeStatus)

export default adminOrderRouter

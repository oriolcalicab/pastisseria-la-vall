import { Router } from 'express'
import type { Request, Response } from 'express'
import { getDeliveryDates } from '../services/deliveryService.js'
import { getCurrentMonth } from '../utils/deliveryDates.js'
import { parseMonthQuery } from '../validation/monthQuery.js'

const handleGetDeliveryDates = async (req: Request, res: Response) => {
  const now = new Date()
  const month = parseMonthQuery(req.query.month, getCurrentMonth(now))

  if (!month) {
    res.status(400).json({ error: 'El mes no és vàlid' })
    return
  }

  res.json(await getDeliveryDates(month, now))
}

const deliveryRouter = Router()

deliveryRouter.get('/', handleGetDeliveryDates)

export default deliveryRouter

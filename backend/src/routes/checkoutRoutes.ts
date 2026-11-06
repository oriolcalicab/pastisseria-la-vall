import { Router } from 'express'
import type { Request, Response } from 'express'
import { getShippingFeeCents } from '../services/settingsService.js'

const handleGetShippingFee = async (_req: Request, res: Response) => {
  res.json({ shippingFeeCents: await getShippingFeeCents() })
}

const checkoutRouter = Router()

checkoutRouter.get('/shipping-fee', handleGetShippingFee)

export default checkoutRouter
import { Router } from 'express'
import type { Request, Response } from 'express'
import { listPickupPoints } from '../services/pickupPointService.js'

const handleListPickupPoints = async (_req: Request, res: Response) => {
  res.json(await listPickupPoints())
}

const pickupPointRouter = Router()

pickupPointRouter.get('/', handleListPickupPoints)

export default pickupPointRouter
import { Router } from 'express'
import type { Request, Response } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'

const handlePing = (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
}

const adminRouter = Router()

adminRouter.use(adminOnly)
adminRouter.get('/ping', handlePing)

export default adminRouter
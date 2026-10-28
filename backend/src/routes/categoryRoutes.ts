import { Router } from 'express'
import type { Request, Response } from 'express'
import { listCategories } from '../services/categoryService.js'

const handleListCategories = async (_req: Request, res: Response) => {
  res.json(await listCategories())
}

const categoryRouter = Router()

categoryRouter.get('/', handleListCategories)

export default categoryRouter
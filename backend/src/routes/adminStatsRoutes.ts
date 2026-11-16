import { Router } from 'express'
import type { Request, Response } from 'express'
import { getAdminStats } from '../services/statsService.js'
import { parseStatsQuery } from '../validation/statsQuery.js'

const handleStats = async (req: Request, res: Response) => {
  const query = parseStatsQuery(req.query)

  if (!query) {
    res.status(400).json({ error: 'Cal enviar un rang de dates vàlid (from i to, màxim 366 dies)' })
    return
  }

  res.json(await getAdminStats(query))
}

const adminStatsRouter = Router()

adminStatsRouter.get('/', handleStats)

export default adminStatsRouter

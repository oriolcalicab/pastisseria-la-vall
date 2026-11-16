import { Router } from 'express'
import type { Request, Response } from 'express'
import { createUploadSignature } from '../services/uploadService.js'

const handleSignature = (_req: Request, res: Response) => {
  res.json(createUploadSignature())
}

const adminUploadRouter = Router()

adminUploadRouter.post('/signature', handleSignature)

export default adminUploadRouter

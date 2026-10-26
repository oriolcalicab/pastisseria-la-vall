import type { NextFunction, Request, Response } from 'express'
import { verifyFirebaseToken } from '../services/tokenService.js'
import { getBearerToken } from '../utils/bearerToken.js'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = getBearerToken(req.headers.authorization)

  if (!token) {
    res.status(401).json({ error: 'Falta el token' })
    return
  }

  const firebaseUser = await verifyFirebaseToken(token).catch(() => null)

  if (!firebaseUser) {
    res.status(401).json({ error: 'Token no vàlid o caducat' })
    return
  }

  res.locals.firebaseUser = firebaseUser
  next()
}

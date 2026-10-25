import type { NextFunction, Request, Response } from 'express'
import { findUserByFirebaseUid } from '../services/userService.js'

export const loadUser = async (_req: Request, res: Response, next: NextFunction) => {
  const firebaseUser = res.locals.firebaseUser

  if (!firebaseUser) {
    res.status(401).json({ error: 'Falta el token' })
    return
  }

  const user = await findUserByFirebaseUid(firebaseUser.uid)

  if (!user) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  res.locals.user = user
  next()
}
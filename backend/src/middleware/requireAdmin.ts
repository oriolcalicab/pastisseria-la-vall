import type { NextFunction, Request, Response } from 'express'

export const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user

  if (!user) {
    res.status(401).json({ error: 'Falta el token' })
    return
  }

  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Accés denegat' })
    return
  }

  next()
}

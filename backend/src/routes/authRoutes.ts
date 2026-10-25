import { Router } from 'express'
import type { Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { verifyToken } from '../middleware/verifyToken.js'
import {
  isUniqueConstraintError,
  registerCustomer,
  toPublicUser,
} from '../services/userService.js'
import { parseRegisterBody } from '../validation/registerBody.js'

const handleRegister = async (req: Request, res: Response) => {
  const firebaseUser = res.locals.firebaseUser

  if (!firebaseUser) {
    res.status(401).json({ error: 'Falta el token' })
    return
  }

  const body = parseRegisterBody(req.body)

  if (!body) {
    res.status(400).json({ error: 'El nom no és vàlid' })
    return
  }

  try {
    const { user, created } = await registerCustomer({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      name: body.name,
    })

    res.status(created ? 201 : 200).json(toPublicUser(user))
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      res.status(409).json({ error: 'Aquest correu ja està registrat' })
      return
    }

    throw error
  }
}

const handleMe = (_req: Request, res: Response) => {
  const user = res.locals.user

  if (!user) {
    res.status(401).json({ error: 'Usuari no registrat' })
    return
  }

  res.json(toPublicUser(user))
}

const authRouter = Router()

authRouter.post('/register', verifyToken, handleRegister)
authRouter.get('/me', requireAuth, handleMe)

export default authRouter
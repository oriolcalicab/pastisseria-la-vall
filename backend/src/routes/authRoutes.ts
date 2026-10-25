import { Router } from 'express'
import type { Request, Response } from 'express'
import { verifyFirebaseToken } from '../services/tokenService.js'
import {
  isUniqueConstraintError,
  registerCustomer,
  toPublicUser,
} from '../services/userService.js'
import { getBearerToken } from '../utils/bearerToken.js'
import { parseRegisterBody } from '../validation/registerBody.js'

const handleRegister = async (req: Request, res: Response) => {
  const token = getBearerToken(req.headers.authorization)

  if (!token) {
    res.status(401).json({ error: 'Falta el token' })
    return
  }

  const firebaseUser = await verifyFirebaseToken(token).catch(() => null)

  if (!firebaseUser) {
    res.status(401).json({ error: 'Token no vàlid' })
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

const authRouter = Router()

authRouter.post('/register', handleRegister)

export default authRouter
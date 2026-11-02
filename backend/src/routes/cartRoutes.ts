import { Router } from 'express'
import type { Request, Response } from 'express'
import { validateCart } from '../services/cartService.js'
import { parseCartValidateBody } from '../validation/cartValidateBody.js'

const handleValidateCart = async (req: Request, res: Response) => {
  const lines = parseCartValidateBody(req.body)

  if (!lines) {
    res.status(400).json({ error: 'El carretó no és vàlid' })
    return
  }

  res.json(await validateCart(lines))
}

const cartRouter = Router()

cartRouter.post('/validate', handleValidateCart)

export default cartRouter
import { rateLimit } from 'express-rate-limit'

const FIFTEEN_MINUTES = 15 * 60 * 1000
const AUTH_LIMIT = 50
const ORDER_LIMIT = 10

export const createRateLimiter = (limit: number, windowMs = FIFTEEN_MINUTES) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: "Massa peticions. Torna-ho a provar d'aquí a una estona." },
  })

export const authLimiter = createRateLimiter(AUTH_LIMIT)

export const orderLimiter = createRateLimiter(ORDER_LIMIT)

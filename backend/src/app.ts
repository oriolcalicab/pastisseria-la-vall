import cors from 'cors'
import express from 'express'
import { createCorsOptions, parseAllowedOrigins } from './config/corsOptions.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { authLimiter, orderLimiter } from './middleware/rateLimits.js'
import adminRouter from './routes/adminRoutes.js'
import authRouter from './routes/authRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import checkoutRouter from './routes/checkoutRoutes.js'
import deliveryRouter from './routes/deliveryRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import pickupPointRouter from './routes/pickupPointRoutes.js'
import productRouter from './routes/productRoutes.js'

export const createApp = (allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGINS)) => {
  const app = express()

  app.set('trust proxy', 1)
  app.use(cors(createCorsOptions(allowedOrigins)))
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/auth', authLimiter, authRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/categories', categoryRouter)
  app.use('/api/products', productRouter)
  app.use('/api/cart', cartRouter)
  app.use('/api/delivery-dates', deliveryRouter)
  app.use('/api/pickup-points', pickupPointRouter)
  app.use('/api/checkout', checkoutRouter)
  app.post('/api/orders', orderLimiter)
  app.use('/api/orders', orderRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

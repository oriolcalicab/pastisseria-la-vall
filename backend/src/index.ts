import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Servidor a http://localhost:${port}`)
})

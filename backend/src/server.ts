import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { healthRouter } from './routes/health.js'
import { errorHandler } from './middleware/errorHandler.js'
import { websiteRouter } from './routes/website.js'

const app = express()
const port = Number(process.env.PORT) || 4000
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10kb' }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))
app.use('/api', healthRouter)
app.use('/api/website', websiteRouter)
app.use(errorHandler)
app.listen(port, () => console.log(`NetShield API listening on port ${port}`))

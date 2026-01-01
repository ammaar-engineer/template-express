import express from 'express'
import 'dotenv/config'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { ErrorMiddleware } from './error'

app.use(helmet())
app.use(cors())
const app = express()
const globalRateLimit = rateLimit({
    // 10 Detik
    windowMs: 10000, 
    // Max request
    max: 10,
    // message error
    message: 'Too many request'
})

// All Endpoint here


app.use(ErrorMiddleware)
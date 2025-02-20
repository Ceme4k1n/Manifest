import express, { Express, Request, Response } from 'express'
const dotenv = require('dotenv')
dotenv.config()
import authRouter from './routes/auth'

const app = express()
const PORT = process.env.PORT || 4000

const path = require('path')
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`)
})

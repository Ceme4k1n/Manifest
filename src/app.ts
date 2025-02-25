import express from 'express'
const dotenv = require('dotenv')
dotenv.config()
import authRouter from './routes/auth'
import profileRouter from './routes/profile'

const app = express()
const PORT = process.env.PORT || 4000

const path = require('path')
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/api', profileRouter)

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`)
})

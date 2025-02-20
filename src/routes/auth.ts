import express, { Express, Request, Response } from 'express'
import { user_login, user_register, user_check_token } from '../controllers/authControlles'

const router = express.Router()

router.post('/login', user_login)
router.post('/reg', user_register)
router.get('/protect', user_check_token)

export default router

import express, { Express, Request, Response } from 'express'
import { user_profile_data } from '../controllers/profileController'

const router = express.Router()

router.get('/user-profile', user_profile_data)

export default router

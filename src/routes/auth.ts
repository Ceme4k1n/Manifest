import express from 'express'
import { user_login, user_register, user_check_token, email_restore, verefi_code, reset_password, verefiEmailCode } from '../controllers/authControlles'

const router = express.Router()

router.post('/login', user_login)
router.post('/reg', user_register)
router.get('/protect', user_check_token)
router.post('/forgot_pass', email_restore)
router.post('/verefi_code', verefi_code)
router.post('/reset_password', reset_password)
router.post('/reg_verefi', verefiEmailCode)
export default router

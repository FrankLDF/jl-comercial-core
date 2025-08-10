import { Router } from 'express'
import { usertRoute } from '../../modules/user/routes/rout.js'
export const pathUser = '/user'

const router = Router()
router.use(pathUser, usertRoute)

export default router

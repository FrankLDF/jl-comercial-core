import { Router } from 'express'
import { userRoute } from '../../modules/user/routes/rout.js'
import { coreRoute } from '../../modules/core/routes/rout.js'
import { clientRoute } from '../../modules/client/routes/clienRoute.js'
export const pathUser = '/user'
export const pathCore = '/core'
export const pathClient = '/client'

const router = Router()
router.use(pathUser, userRoute)
router.use(pathCore, coreRoute)
router.use(pathClient, clientRoute)

export default router

import { Router } from 'express'
import { userRoute } from '../../modules/user/routes/rout.js'
import { coreRoute } from '../../modules/core/routes/rout.js'
import { clientRoute } from '../../modules/client/routes/clienRoute.js'
import { personalRoute } from '../../modules/personal/routes/personalRoute.js'

export const pathUser = '/user'
export const pathCore = '/core'
export const pathClient = '/client'
export const pathPersonal = '/personal'

const router = Router()
router.use(pathUser, userRoute)
router.use(pathCore, coreRoute)
router.use(pathClient, clientRoute)
router.use(pathPersonal, personalRoute)

export default router

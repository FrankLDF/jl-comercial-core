import { Router } from 'express'
import { userRoute } from '../../modules/user/routes/rout.js'
import { coreRoute } from '../../modules/core/routes/rout.js'
import { clientRoute } from '../../modules/client/routes/clienRoute.js'
import { personalRoute } from '../../modules/personal/routes/personalRoute.js'
import { proveedorRoute } from '../../modules/proveedor/routes/proveedorRoute.js'

export const pathUser = '/user'
export const pathCore = '/core'
export const pathClient = '/client'
export const pathPersonal = '/personal'
export const pathProveedor = '/proveedor'

const router = Router()
router.use(pathUser, userRoute)
router.use(pathCore, coreRoute)
router.use(pathClient, clientRoute)
router.use(pathPersonal, personalRoute)
router.use(pathProveedor, proveedorRoute)

export default router

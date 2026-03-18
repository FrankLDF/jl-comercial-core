import { Router } from 'express'
import { userRoute } from '../../modules/user/routes/rout.js'
import { coreRoute } from '../../modules/core/routes/rout.js'
import { clientRoute } from '../../modules/client/routes/clienRoute.js'
import { personalRoute } from '../../modules/personal/routes/personalRoute.js'
import { proveedorRoute } from '../../modules/proveedor/routes/proveedorRoute.js'
import { recepcionRoute } from '../../modules/recepcion/routes/recepcionRoute.js'
import { inventarioRoute } from '../../modules/inventario/routes/inventarioRoute.js'
import ventaRoute from '../../modules/venta/routes/ventaRoutes.js'
import documentRoute from '../../modules/documents/routes/document.routes.js'

export const pathUser = '/user'
export const pathCore = '/core'
export const pathClient = '/client'
export const pathPersonal = '/personal'
export const pathProveedor = '/proveedor'
export const pathRecepcion = '/recepcion'
export const pathInventario = '/inventario'
export const pathVenta = '/venta'
export const pathDocuments = '/documents'

const router = Router()
router.use(pathUser, userRoute)
router.use(pathCore, coreRoute)
router.use(pathClient, clientRoute)
router.use(pathPersonal, personalRoute)
router.use(pathProveedor, proveedorRoute)
router.use(pathRecepcion, recepcionRoute)
router.use(pathInventario, inventarioRoute)
router.use(pathVenta, ventaRoute)
router.use(pathDocuments, documentRoute)

export default router

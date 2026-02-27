import { Router } from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.js'
import { ProveedorController } from '../controller/proveedorController.js'

export const proveedorRoute = Router()
const _proveedorController = new ProveedorController()

proveedorRoute
  .get('/', authMiddleware as never, _proveedorController.get)
  .post('/', authMiddleware as never, _proveedorController.upsert)

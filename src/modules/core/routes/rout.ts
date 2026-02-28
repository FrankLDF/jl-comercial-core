import { Router } from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.js'
import { generalController } from '../controllers/controllers.js'

export const coreRoute = Router()
const _coreController = new generalController()

coreRoute.get(
  '/country',
  authMiddleware as never,
  _coreController.getCounry as never
)
coreRoute.get(
  '/municipe',
  authMiddleware as never,
  _coreController.getMunicip as never
)
coreRoute.get(
  '/province',
  authMiddleware as never,
  _coreController.getProvince as never
)
coreRoute.get(
  '/sector',
  authMiddleware as never,
  _coreController.getSector as never
)

coreRoute.get(
  '/marca',
  authMiddleware as never,
  _coreController.getMarca as never
)
coreRoute.get(
  '/modelo',
  authMiddleware as never,
  _coreController.getModelo as never
)
coreRoute.get(
  '/estilo',
  authMiddleware as never,
  _coreController.getEstilo as never
)
coreRoute.get(
  '/color',
  authMiddleware as never,
  _coreController.getColor as never
)

import { Router } from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.js'
import { ClientController } from '../controller/clienController.js'

export const clientRoute = Router()
const _clientController = new ClientController()

clientRoute
  .get('/', authMiddleware as never, _clientController.get)
  .post('/', authMiddleware as never, _clientController.upsert)
// .put('/:id', authMiddleware as never, _clientController.updateStatus)

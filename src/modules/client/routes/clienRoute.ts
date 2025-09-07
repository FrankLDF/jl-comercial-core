import { Router } from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.js'
import { ClientService } from '../services/clientService.js'
import { ClientController } from '../controller/clienController.js'

export const clientRoute = Router()
const _clientController = new ClientController()

clientRoute
  .post(
    '/search',
    authMiddleware as never,
    _clientController.getClient as never
  )
  .post('/', authMiddleware as never, _clientController.upsertClient as never)

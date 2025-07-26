import { Router } from 'express'
import { ClienteController } from '../controller/client.controler.js'

export const clientRouter = Router()
const controller = new ClienteController()

clientRouter.get('/', controller.listarClientes as never)

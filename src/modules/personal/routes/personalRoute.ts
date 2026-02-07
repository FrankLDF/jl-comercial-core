import { Router } from 'express'
import { authMiddleware } from '../../../common/middlewares/auth.js'
import { PersonalController } from '../controller/personalController.js'

export const personalRoute = Router()
const _personalController = new PersonalController()

personalRoute
  .get('/', authMiddleware as never, _personalController.get)
  .get('/one', authMiddleware as never, _personalController.getOne)
  .post('/', authMiddleware as never, _personalController.upsert)

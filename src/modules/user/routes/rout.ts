import { Router } from 'express'
import { UserController } from '../controller/controler.js'
import { authMiddleware } from '../../../common/middlewares/auth.js'

export const userRoute = Router()
const _userController = new UserController()

userRoute.post('/login', _userController.login as never)

userRoute.post(
  '/logout',
  authMiddleware as never,
  _userController.logout as never,
)
userRoute.get('/me', authMiddleware as never, _userController.getMe as never)
userRoute.post(
  '/',
  authMiddleware as never,
  _userController.createUser as never,
)
userRoute.get('/', authMiddleware as never, _userController.getUsers as never)

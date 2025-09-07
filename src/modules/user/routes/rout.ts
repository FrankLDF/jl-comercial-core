import { Router } from 'express'
import { UserController } from '../controller/controler.js'
import { authMiddleware } from '../../../common/middlewares/auth.js'

export const userRoute = Router()
const _userController = new UserController()

userRoute.post(
  '/',
  authMiddleware as never,
  _userController.createUser as never
)
userRoute.post('/login', _userController.login as never)
userRoute.post('/logout', _userController.logout as never)

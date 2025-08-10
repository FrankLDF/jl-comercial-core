import { Router } from 'express'
import { UserController } from '../controller/controler.js'

export const usertRoute = Router()
const _userController = new UserController()

usertRoute.get('/', _userController.createUser as never)
usertRoute.get('/login', _userController.login as never)
usertRoute.get('/logout', _userController.logout as never)

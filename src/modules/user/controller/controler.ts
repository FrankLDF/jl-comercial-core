import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/services.js'

const _userService = new UserService()

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Para el setup inicial, usar 'SYSTEM' si no hay usuario autenticado
      const creator = req.user?.username || 'SYSTEM'
      const user = await _userService.create(req.body, creator)
      res.ok(user, 'Usuario creado exitosamente')
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await _userService.login(req.body, res)
      res.ok(user, 'Inicio de sesión exitoso')
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await _userService.logout(res)
      res.ok(result, 'Sesión cerrada exitosamente')
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await _userService.getUsers()
      res.ok(users, 'Usuarios obtenidos exitosamente')
    } catch (error) {
      next(error)
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await _userService.getMe(req.user!.username)
      res.ok(user, 'Usuario obtenido exitosamente')
    } catch (error) {
      next(error)
    }
  }
}

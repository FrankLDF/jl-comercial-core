import { Request, Response } from 'express'
import { UserService } from '../services/services.js'
import {
  validateFull,
  validatePartial,
} from '../../../common/utils/validator.js'
import { userDto, userSchema } from '../validators/schema.js'
import { SafeParseReturnType } from 'zod'
import { loginDto } from '../dto/dto.js'

const _userService = new UserService()

export class UserController {
  createUser = async (req: Request, res: Response) => {
    const validation = validateFull(userSchema, req.body)

    if (!validation.success) {
      return res.status(400).json({
        errors: validation.error.errors,
      })
    }

    try {
      const user = await _userService.create(validation.data as userDto)
      return res.status(201).json(user)
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
  login = async (req: Request, res: Response) => {
    try {
      const validation: SafeParseReturnType<loginDto, unknown> =
        validatePartial(userSchema, req.body)
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() })
      }
      const loginData = validation.data as loginDto
      const user = await _userService.login(loginData, res)
      return res.status(200).json({ user })
    } catch (error: any) {
      return res.status(401).json({ message: error.message })
    }
  }
  logout = async (req: Request, res: Response) => {
    try {
      await _userService.logout(res)
      return res.status(200).json({ message: 'Sesión cerrada correctamente' })
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}

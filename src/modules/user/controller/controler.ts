import { NextFunction, Request, Response } from 'express'
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
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const validation = validateFull(userSchema, req.body)

    if (!validation.success) {
      return res.status(400).json({
        errors: validation.error.errors,
      })
    }

    try {
      const user = await _userService.create(validation.data as userDto)
      return res.ok(user)
    } catch (error) {
      next(error)
    }
  }
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation: SafeParseReturnType<loginDto, unknown> =
        validatePartial(userSchema, req.body)
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.format() })
      }
      const loginData = validation.data as loginDto
      const user = await _userService.login(loginData, res)
      return res.ok({ user })
    } catch (error) {
      next(error)
    }
  }
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await _userService.logout(res)
      return res.ok({ message: 'Logout successful', status: 200 })
    } catch (error) {
      next(error)
    }
  }
}

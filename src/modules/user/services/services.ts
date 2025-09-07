import { loginDto } from '../dto/dto.js'
import { UserRepository } from '../repositories/repository.js'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { createRequire } from 'module'
import { userDto } from '../validators/schema.js'
const require = createRequire(import.meta.url)
const bcrypt = require('bcrypt')

const _userRepository = new UserRepository()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token'

export class UserService {
  async create(userData: userDto) {
    const existingUser = await _userRepository.getOne({
      NOMBRE_USUARIO: userData.NOMBRE_USUARIO,
    })
    if (existingUser) throw new Error('El usuario ya existe')

    const hashedPassword = await bcrypt.hash(userData.PASSWORD, 10)

    const newUser = await _userRepository.create({
      ...userData,
      PASSWORD: hashedPassword,
      FECHA_INSERCION: new Date(),
    })

    const { PASSWORD: _, ...userSecure } = newUser
    return { userSecure }
  }

  async login(condition: loginDto, res: Response) {
    try {
      const { NOMBRE_USUARIO, PASSWORD } = condition

      const user = await _userRepository.getOne({ NOMBRE_USUARIO })
      if (!user) throw new Error('Usuario no encontrado')

      const validPassword = await bcrypt.compare(PASSWORD, user.PASSWORD)
      if (!validPassword) throw new Error('Contraseña incorrecta')

      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const msUntilMidnight = midnight.getTime() - now.getTime()

      const token = jwt.sign(
        { sub: user.ID, username: user.NOMBRE_USUARIO },
        JWT_SECRET,
        { expiresIn: Math.floor(msUntilMidnight / 1000) }
      )

      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: msUntilMidnight,
      })

      const { PASSWORD: _, ...safeUser } = user

      return safeUser
    } catch (error) {
      console.log('Error en el servicio de login ' + error)
      throw error
    }
  }

  async logout(res: Response) {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    })
    return { message: 'Sesión cerrada correctamente' }
  }
  async getUsers() {
    return await _userRepository.getAll()
  }
}

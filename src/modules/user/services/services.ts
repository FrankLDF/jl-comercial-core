import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { createRequire } from 'module'
import prisma from '../../../config/prismaConnect.js'
import { AppError } from '../../../common/errors/AppError.js'
import { UserRepository } from '../repositories/repository.js'
import {
  LoginSchema,
  UserCreateSchema,
  UserCreateDto,
  LoginDto,
} from '../validators/schema.js'
import { PersonalRepository } from '../../personal/repository/personalRepository.js'

const require = createRequire(import.meta.url)
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token'

export class UserService {
  async create(userData: UserCreateDto, creatorUsername: string) {
    return prisma.$transaction(async (tx) => {
      const userRepo = new UserRepository(tx)
      const personalRepo = new PersonalRepository(tx)

      // Validar datos
      const validData = UserCreateSchema.parse(userData)

      // Verificar si el usuario ya existe
      const existingUser = await userRepo.existsByUsername(
        validData.nombre_usuario,
      )
      if (existingUser) {
        throw new AppError('El nombre de usuario ya está en uso', 400)
      }

      // Verificar si el personal existe y está activo
      const personal = await personalRepo.getOne({ id: validData.id_personal })
      if (!personal) {
        throw new AppError('El personal especificado no existe', 404)
      }

      if (personal.estado !== 'A') {
        throw new AppError('El personal especificado no está activo', 400)
      }

      // Verificar si el personal ya tiene un usuario
      const existingUserForPersonal = await userRepo.existsByPersonalId(
        validData.id_personal,
      )
      if (existingUserForPersonal) {
        throw new AppError('Este personal ya tiene un usuario asignado', 400)
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(validData.password, 10)

      // Crear usuario
      const newUser = await userRepo.create({
        id_personal: validData.id_personal,
        nombre_usuario: validData.nombre_usuario,
        password: hashedPassword,
        estado: validData.estado,
        usuario_insercion: creatorUsername,
      })

      // Retornar usuario sin contraseña
      const { password: _, ...userSecure } = newUser
      return userSecure
    })
  }

  async login(credentials: LoginDto, res: Response) {
    return prisma.$transaction(async (tx) => {
      const userRepo = new UserRepository(tx)

      // Validar datos
      const validCredentials = LoginSchema.parse(credentials)

      // Buscar usuario
      const user = await userRepo.getOne({
        nombre_usuario: validCredentials.nombre_usuario,
      })

      if (!user) {
        throw new AppError('Credenciales incorrectas', 401)
      }

      // Verificar si el usuario está activo
      if (user.estado !== 'A') {
        throw new AppError('Usuario inactivo. Contacte al administrador', 403)
      }

      // Verificar si el personal está activo
      // if (user.PERSONAL?.ESTADO !== 'A') {
      //   throw new AppError('Personal inactivo. Contacte al administrador', 403)
      // }

      // Verificar contraseña
      const validPassword = await bcrypt.compare(
        validCredentials.password,
        user.password,
      )

      if (!validPassword) {
        throw new AppError('Credenciales incorrectas', 401)
      }

      // Calcular expiración hasta medianoche
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const msUntilMidnight = midnight.getTime() - now.getTime()

      // Generar token
      const token = jwt.sign(
        {
          sub: user.id,
          username: user.nombre_usuario,
          personalId: user.id_personal,
        },
        JWT_SECRET,
        { expiresIn: Math.floor(msUntilMidnight / 1000) },
      )

      // Establecer cookie
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: msUntilMidnight,
      })

      // Retornar usuario sin contraseña
      const { password: _, ...safeUser } = user

      return { ...safeUser, token }
    })
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
    const userRepo = new UserRepository(prisma)
    const users = await userRepo.getAll({
      where: {
        estado: 'A',
      },
    })

    // Remover contraseñas
    return users.map(({ password: _, ...user }) => user)
  }

  async getMe(username: string) {
    const userRepo = new UserRepository(prisma)
    const user = await userRepo.getOne({
      nombre_usuario: username,
      estado: 'A',
    })

    if (!user) {
      throw new AppError('Usuario no encontrado', 404)
    }

    // Remover contraseña
    const { password: _, ...safeUser } = user
    return safeUser
  }
}

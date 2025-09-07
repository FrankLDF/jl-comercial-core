import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token'
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies[COOKIE_NAME]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No autorizado. Cookie no encontrada.' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    ;(req as any).user = decoded

    next()
  } catch (error) {
    console.log('Error en middleware de autenticación:', error)
    return res.status(401).json({ message: 'Token inválido o expirado.' })
  }
}

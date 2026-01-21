import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError.js'

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.fail('Datos inválidos', 400, err.format())
    return
  }

  if (err instanceof AppError) {
    res.fail(err.message, err.statusCode, err.details)
    return
  }

  console.error('[UNHANDLED ERROR]', err)
  res.fail('Error interno del servidor', 500)
}

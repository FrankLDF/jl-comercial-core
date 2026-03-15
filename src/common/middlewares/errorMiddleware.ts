import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError.js'
import { Logger } from '../utils/logger.js'

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the technical error
  const errorMessage = err instanceof Error ? err.message : String(err);
  Logger.error(`[${req.method} ${req.path}] ${errorMessage}`, err);

  if (err instanceof ZodError) {
    res.fail('Datos inválidos o faltantes en la solicitud', 400, err.format())
    return
  }

  if (err instanceof AppError) {
    res.fail(err.message, err.statusCode, err.details)
    return
  }

  // Error no manejado (Error 500)
  res.fail('Ha ocurrido un error.', 500)
}

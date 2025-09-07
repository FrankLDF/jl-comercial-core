import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}

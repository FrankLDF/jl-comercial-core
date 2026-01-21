import { Request, Response, NextFunction } from 'express'
import { errorResponse, successResponse } from '../http/ApiResponse.js'

export const responseHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.ok = <T>(data: T, message?: string) => {
    return res.json(successResponse(data, message))
  }

  res.fail = (message: string, status = 400, errors?: unknown) => {
    return res.status(status).json(errorResponse(message, errors))
  }

  next()
}

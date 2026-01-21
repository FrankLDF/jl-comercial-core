export class AppError extends Error {
  public readonly statusCode: number
  public readonly details?: unknown
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message)

    this.statusCode = statusCode
    this.details = details
    this.isOperational = true

    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this)
  }
}

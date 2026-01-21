import 'express'
import { UserLoged } from '@/modules/core/dto/dto'
import { ApiResponse } from '@/common/http/ApiResponse'

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserLoged
  }

  interface Response {
    ok<T>(data: T, message?: string): Response<ApiResponse<T>>
    fail(
      message: string,
      status?: number,
      errors?: unknown
    ): Response<ApiResponse<null>>
  }
}

export {}

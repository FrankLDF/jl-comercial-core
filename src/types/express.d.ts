import 'express'
import { UserLoged } from '../modules/core/dto/dto.ts'

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserLoged
  }
}

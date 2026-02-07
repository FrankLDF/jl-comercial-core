import { NextFunction, Request, Response } from 'express'
import { PersonalDto } from '../dto/personalDto.js'
import { PersonalService } from '../service/personalService.js'

const service = new PersonalService()

export class PersonalController {
  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: PersonalDto = req.body
      const user = req.user || { username: 'SYSTEM' }
      const result = await service.upsert(payload, user)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: PersonalDto = req.query
      const result = await service.get(filters)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: PersonalDto = req.query
      const result = await service.getOne(filters)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }
}

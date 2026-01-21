import { NextFunction, Request, Response } from 'express'
import { ClientService } from '../services/clientService.js'
import { ClientDto } from '../dto/clientDto.js'

const service = new ClientService()

export class ClientController {
  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: ClientDto = req.body
      const result = await service.upsert(payload, req.user)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: ClientDto = req.query
      const result = await service.get(filters)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }
}

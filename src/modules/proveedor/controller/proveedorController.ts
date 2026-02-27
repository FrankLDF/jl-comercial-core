import { NextFunction, Request, Response } from 'express'
import { ProveedorService } from '../services/proveedorService.js'
import { ProveedorDto } from '../dto/proveedorDto.js'

const service = new ProveedorService()

export class ProveedorController {
  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: ProveedorDto = req.body
      const result = await service.upsert(payload, req.user)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = req.query
      const result = await service.get(filters)
      res.ok(result)
    } catch (err) {
      next(err)
    }
  }
}

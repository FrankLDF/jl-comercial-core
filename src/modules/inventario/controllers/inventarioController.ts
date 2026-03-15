import { NextFunction, Request, Response } from 'express';
import { InventarioService } from '../services/inventarioService.js';

const inventarioService = new InventarioService();

export class InventarioController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const result = await inventarioService.list(filters);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

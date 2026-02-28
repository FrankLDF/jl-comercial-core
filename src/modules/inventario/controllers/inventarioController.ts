import { Request, Response } from 'express';
import { InventarioService } from '../services/inventarioService.js';

const inventarioService = new InventarioService();

export class InventarioController {
  async list(req: Request, res: Response) {
    try {
      const filters = req.query;
      const result = await inventarioService.list(filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al listar el inventario' });
    }
  }
}

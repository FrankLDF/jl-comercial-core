import { Request, Response, NextFunction } from 'express';
import { CargoService } from '../services/cargoService.js';

const cargoService = new CargoService();

export class CargoController {
  async listarTiposCargos(req: Request, res: Response, next: NextFunction) {
    try {
      const cargos = await cargoService.listarTiposCargos();
      res.json({ success: true, data: cargos });
    } catch (e) {
      next(e);
    }
  }

  async crearTipoCargo(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = req.body.usuario_insercion || 'SISTEMA';
      const cargo = await cargoService.crearTipoCargo(req.body, usuario);
      res.status(201).json({ success: true, data: cargo });
    } catch (e) {
      next(e);
    }
  }
}

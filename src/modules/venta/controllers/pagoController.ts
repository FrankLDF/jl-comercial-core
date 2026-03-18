import { Request, Response, NextFunction } from 'express';
import { PagoService } from '../services/pagoService.js';
import { RegistrarPagoSchema } from '../validator/schema.js';

const pagoService = new PagoService();

export class PagoController {
  async registrarPago(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = RegistrarPagoSchema.parse(req.body);
      const user = (req as any).user?.username || 'SYSTEM';
      const result = await pagoService.registrarPago(validatedData, user);
      res.status(201).json({
        success: true,
        message: 'Pago registrado y aplicado exitosamente',
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  async obtenerPagosVenta(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await pagoService.obtenerPagosVenta(Number(id));
      res.json({ success: true, data: result });
    } catch (error: any) {
      next(error);
    }
  }
}

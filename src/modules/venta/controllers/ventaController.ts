import { NextFunction, Request, Response } from 'express';
import { VentaService } from '../services/ventaService.js';
import { CreateVentaSchema } from '../validator/schema.js';
import { CuotaService } from '../services/cuotaService.js';
import { AppError } from '../../../common/errors/AppError.js';

const ventaService = new VentaService();
const cuotaService = new CuotaService();

export class VentaController {
  async crearVenta(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = CreateVentaSchema.parse(req.body);
      const user = (req as any).user?.username || 'SYSTEM';
      const result = await ventaService.crearVenta(validatedData, user);
      res.status(201).json({
        success: true,
        message: 'Venta registrada exitosamente',
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  async obtenerVenta(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ventaService.obtenerVenta(Number(id));
      if (!result) throw new AppError('Venta no encontrada', 404);
      res.json({ success: true, data: result });
    } catch (error: any) {
      next(error);
    }
  }

  async listarVentas(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ventaService.listarVentas();
      res.json({ success: true, data: result });
    } catch (error: any) {
      next(error);
    }
  }

  async cancelarVenta(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = (req as any).user?.username || 'SYSTEM';
      const result = await ventaService.cancelarVenta(Number(id), user);
      res.json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  }

  async getCuotas(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await cuotaService.obtenerCuotasPorVenta(Number(id));
      res.json({ success: true, data: result });
    } catch (error: any) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { RecepcionService } from '../services/recepcionService.js';
import { createRecepcionSchema, cerrarRecepcionSchema } from '../validator/schema.js';
import { AppError } from '../../../common/errors/AppError.js';

const recepcionService = new RecepcionService();

export class RecepcionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createRecepcionSchema.parse(req.body);
      const result = await recepcionService.create(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async cerrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new AppError('El ID de la recepción es obligatorio.', 400);
      
      const { usuario_actualizacion } = cerrarRecepcionSchema.parse(req.body);
      const result = await recepcionService.cerrar(Number(id), usuario_actualizacion);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await recepcionService.findById(Number(id));
      if (!result) throw new AppError('No se encontró la recepción solicitada o ha sido eliminada.', 404);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await recepcionService.list();
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
}

import { Request, Response } from 'express';
import { RecepcionService } from '../services/recepcionService.js';
import { createRecepcionSchema, cerrarRecepcionSchema } from '../validator/schema.js';

const recepcionService = new RecepcionService();

export class RecepcionController {
  async create(req: Request, res: Response) {
    try {
      const validatedData = createRecepcionSchema.parse(req.body);
      const result = await recepcionService.create(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al crear la recepción' });
    }
  }

  async cerrar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { usuario_actualizacion } = cerrarRecepcionSchema.parse(req.body);
      const result = await recepcionService.cerrar(Number(id), usuario_actualizacion);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al cerrar la recepción' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await recepcionService.findById(Number(id));
      if (!result) return res.status(404).json({ error: 'Recepción no encontrada' });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al buscar la recepción' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const result = await recepcionService.list();
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al listar las recepciones' });
    }
  }
}

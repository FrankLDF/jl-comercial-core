import { z } from 'zod';

export const createRecepcionDetalleSchema = z.object({
  // Datos del Vehículo (para Upsert)
  chasis: z.string().min(1),
  numero_maquina: z.string().optional(),
  placa: z.string().optional(),
  id_marca: z.number().int().positive(),
  id_modelo: z.number().int().positive(),
  id_estilo: z.number().int().positive(),
  id_color: z.number().int().positive(),
  anio: z.number().int().positive(),
  cilindraje: z.number().int().positive().optional(),
  
  // Datos del Ingreso/Costo
  condicion: z.enum(['NUEVO', 'USADO']),
  precio_venta_estimado: z.number().positive(),
  costo_unitario: z.number().positive(),
  otros_costos: z.number().nonnegative().optional().default(0),
});

export const createRecepcionSchema = z.object({
  id: z.number().int().positive().optional(),
  id_proveedor: z.number().int().positive().optional(),
  tipo_pago: z.enum(['CONTADO', 'CREDITO']).optional(),
  inicial: z.number().nonnegative().optional(),
  estado_recepcion: z.enum(['ABIERTA', 'CERRADA', 'ANULADA']).optional(),
  detalles: z.array(createRecepcionDetalleSchema).optional(),
  usuario_insercion: z.string().min(1).optional(),
});

export type CreateRecepcionDto = z.infer<typeof createRecepcionSchema>;
export type CreateRecepcionDetalleDto = z.infer<typeof createRecepcionDetalleSchema>;

export const cerrarRecepcionSchema = z.object({
  usuario_actualizacion: z.string().min(1),
});

import { z } from 'zod';

export const VentaDetalleSchema = z.object({
  id_vehiculo_ingreso: z.coerce.number(),
  precio_venta: z.coerce.number().positive(),
});

export const VentaCargoSchema = z.object({
  id_cargo_tipo: z.coerce.number(),
  monto: z.coerce.number().positive(),
});

export const CreateVentaSchema = z.object({
  id_cliente: z.coerce.number(),
  tipo_pago: z.enum(['CONTADO', 'CREDITO']),
  inicial: z.coerce.number().nonnegative().optional().default(0),
  tasa_interes: z.coerce.number().nonnegative().optional().default(0),
  cantidad_cuotas: z.coerce.number().int().positive().optional(),
  detalles: z.array(VentaDetalleSchema).min(1),
  cargos: z.array(VentaCargoSchema).optional().default([]),
  comentario_pago: z.string().optional(),
  usuario_insercion: z.string().optional(),
});

export const PagoDistribucionSchema = z.object({
  tipo: z.enum(['CUOTA', 'CARGO']),
  id_referencia: z.coerce.number(), // id_venta_cuota o id_venta_cargo
  monto: z.coerce.number().positive(),
  monto_mora: z.coerce.number().nonnegative().optional().default(0),
  descripcion: z.string().optional(),
});

export const RegistrarPagoSchema = z.object({
  id_venta: z.coerce.number(),
  monto_total: z.coerce.number().positive(),
  metodo_pago: z.string().optional().default('EFECTIVO'),
  descripcion: z.string().optional(),
  distribucion: z.array(PagoDistribucionSchema).min(1),
  usuario_insercion: z.string().optional(),
});

export type CreateVentaDto = z.infer<typeof CreateVentaSchema>;
export type RegistrarPagoDto = z.infer<typeof RegistrarPagoSchema>;
export type VentaDetalleDto = z.infer<typeof VentaDetalleSchema>;
export type VentaCargoDto = z.infer<typeof VentaCargoSchema>;
export type PagoDistribucionDto = z.infer<typeof PagoDistribucionSchema>;

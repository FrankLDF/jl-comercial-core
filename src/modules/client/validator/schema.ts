import z from 'zod'
import { EntitySchema } from '../../core/validators/shemas/entity.js'

export const ClientSchema = z.object({
  ID: z.number().int().positive().optional(),
  ESTADO: z.string().optional(),
  FECHA_INSERCION: z.coerce.date().optional(),
  USUARIO_INSERCION: z.string().optional(),
  FECHA_ACTUALIZACION: z.coerce.date().nullish(),
  USUARIO_ACTUALIZACION: z.string().nullish(),
})

export const ClientWithEntitySchema = z.object({
  CLIENTE: ClientSchema,
  ENTIDAD: EntitySchema,
})

import z from 'zod'
import { EntitySchema } from '../../core/validators/shemas/entity.js'

export const ProveedorUpsertSchema = z.object({
  id: z.number().int().positive().optional(),
  estado: z.string().optional(),
  entidad: EntitySchema.partial().optional(),
})

export const ProveedorFilterSchema = ProveedorUpsertSchema.partial()

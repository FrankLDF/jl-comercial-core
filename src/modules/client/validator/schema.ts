import z from 'zod'
import { EntitySchema } from '../../core/validators/shemas/entity.js'

export const ClientUpsertSchema = z.object({
  id: z.number().int().positive().optional(),
  estado: z.string().optional(),
  entidad: EntitySchema.partial().optional(),
})

export const ClientFilterSchema = ClientUpsertSchema.partial()

export const ClientWithEntitySchema = z.object({
  cliente: ClientUpsertSchema.optional(),
  entidad: EntitySchema.optional(),
})

import z from 'zod'
import { EntitySchema } from '../../core/validators/shemas/entity.js'

export const ClientUpsertSchema = z.object({
  ID: z.number().int().positive().optional(),
  ESTADO: z.string().optional(),
  ENTIDAD: EntitySchema.optional(),
})

export const ClientFilterSchema = ClientUpsertSchema.partial()

export const ClientWithEntitySchema = z.object({
  CLIENTE: ClientUpsertSchema.optional(),
  ENTIDAD: EntitySchema.optional(),
})

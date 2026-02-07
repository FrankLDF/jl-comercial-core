import z from 'zod'
import { EntitySchema } from '../../core/validators/shemas/entity'

export const PersonalUpsertSchema = z.object({
  id: z.number().int().positive().optional(),
  id_puesto: z.number().int().positive().optional(),
  estado: z.string().optional(),
  entidad: EntitySchema.optional(),
})

export const PersonalFilterSchema = PersonalUpsertSchema.partial()

export const PersonalWithEntitySchema = z.object({
  personal: PersonalUpsertSchema.optional(),
  entidad: EntitySchema.optional(),
})

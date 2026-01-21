import z from 'zod'

export const userSchema = z.object({
  ID: z.number().int().optional(),
  NOMBRE_USUARIO: z.string().optional(),
  PASSWORD: z.string().min(6).optional(),
  ESTADO: z.string().optional(),
  PERSONAL: z.optional(),
})
export type userDto = z.infer<typeof userSchema>

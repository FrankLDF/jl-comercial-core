import z from 'zod'

export const createClienteSchema = z.object({
  nombre: z.string(),
  email: z.string().email(),
})
export type CreateClienteDto = z.infer<typeof createClienteSchema>

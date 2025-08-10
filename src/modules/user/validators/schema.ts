import z from 'zod'

export const userSchema = z.object({
  ID: z.number().int().optional(),
  ID_PERSONAL: z.number().int(),
  NOMBRE_USUARIO: z.string(),
  PASSWORD: z.string().min(6),
  ESTADO: z.string(),
  FECHA_INSERCION: z
    .preprocess(
      (arg) =>
        typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg,
      z.date()
    )
    .optional(),
  USUARIO_INSERCION: z.string(),
  FECHA_ACTUALIZACION: z.preprocess(
    (arg) =>
      arg
        ? typeof arg === 'string' || arg instanceof Date
          ? new Date(arg)
          : arg
        : undefined,
    z.date().optional()
  ),
  USUARIO_ACTUALIZACION: z.string().optional(),
})
export type userDto = z.infer<typeof userSchema>

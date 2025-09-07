import z from 'zod'

export const MunicipioSchema = z.object({
  ID: z.number().int().positive(),
  ID_PROVINCIA: z.number().int().positive(),
  NOMBRE: z.string().min(1, 'El nombre es requerido'),
  ESTADO: z.string().min(1, 'El estado es requerido'),
  FECHA_INSERCION: z
    .date()
    .optional()
    .default(() => new Date()),
  USUARIO_INSERCION: z.string().min(1, 'El usuario de inserción es requerido'),
  FECHA_ACTUALIZACION: z.date().optional(),
  USUARIO_ACTUALIZACION: z.string().optional(),
})

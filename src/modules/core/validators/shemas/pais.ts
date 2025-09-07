import z from 'zod'

export const PaisSchema = z.object({
  ID: z.string(),
  NOMBRE: z.string().min(1, 'El nombre es requerido'),
  NACIONALIDAD: z.string().min(1, 'La nacionalidad es requerida'),
  ESTADO: z.string().min(1, 'El estado es requerido'),
  FECHA_INSERCION: z
    .date()
    .optional()
    .default(() => new Date()),
  USUARIO_INSERCION: z.string().min(1, 'El usuario de inserción es requerido'),
  FECHA_ACTUALIZACION: z.date().optional(),
  USUARIO_ACTUALIZACION: z.string().optional(),
})

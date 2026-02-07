import z from 'zod'

export const PaisSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  nacionalidad: z.string().min(1, 'La nacionalidad es requerida'),
  estado: z.string().min(1, 'El estado es requerido'),
  fecha_insercion: z
    .date()
    .optional()
    .default(() => new Date()),
  usuario_insercion: z.string().min(1, 'El usuario de inserción es requerido'),
  fecha_actualizacion: z.date().optional(),
  usuario_actualizacion: z.string().optional(),
})

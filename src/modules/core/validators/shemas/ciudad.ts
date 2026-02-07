import z from 'zod'

export const CiudadSchema = z.object({
  id: z.number().int().positive(),
  id_municipio: z.number().int().positive(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  estado: z.string().min(1, 'El estado es requerido'),
  fecha_insercion: z
    .date()
    .optional()
    .default(() => new Date()),
  usuario_insercion: z.string().min(1, 'El usuario de inserción es requerido'),
  fecha_actualizacion: z.date().optional(),
  usuario_actualizacion: z.string().optional(),
})

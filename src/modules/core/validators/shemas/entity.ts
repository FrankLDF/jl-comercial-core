import z from 'zod'

export const EntitySchema = z.object({
  id: z.number().int().positive().optional(),
  tipo_entidad: z.string().min(1, 'El tipo de entidad es requerido'),
  tipo_doc_ident: z
    .number()
    .int()
    .positive('El tipo de documento es requerido'),
  documento_ident: z.string().min(1, 'El documento de identidad es requerido'),
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  apellidos: z.string().optional(),
  sexo: z.string().optional(),
  estado_civil: z.string().optional(),
  telefono: z.string().optional(),
  tipo_empleo: z.string().optional(),
  nombre_empresa_trabajo: z.string().optional(),
  ocupacion: z.string().optional(),
  posicion_empresa: z.string().optional(),
  moneda_ingreso: z.string().optional(),
  ingreso_promedio: z.number().int().nonnegative().optional(),
  otro_ingreso: z.number().int().nonnegative().optional(),
  razon_otro_ingreso: z.string().optional(),
  email: z.string().email('Formato de email inválido').optional(),
  id_pais: z.string().optional(),
  id_provincia: z.number().int().positive().optional(),
  id_municipio: z.number().int().positive().optional(),
  id_ciudad: z.number().int().positive().optional(),
  desc_direccion: z.string().optional(),
  fecha_nacimiento: z.coerce.date().optional(),
  estado: z.string().min(1, 'El estado es requerido'),
})

export const EntityFilterSchema = EntitySchema.partial()

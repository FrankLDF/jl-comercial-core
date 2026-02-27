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
  apellidos: z.string().nullish(),
  sexo: z.string().nullish(),
  estado_civil: z.string().nullish(),
  telefono: z.string().nullish(),
  tipo_empleo: z.string().nullish(),
  nombre_empresa_trabajo: z.string().nullish(),
  ocupacion: z.string().nullish(),
  posicion_empresa: z.string().nullish(),
  moneda_ingreso: z.string().nullish(),
  ingreso_promedio: z.number().int().nonnegative().nullish(),
  otro_ingreso: z.number().int().nonnegative().nullish(),
  razon_otro_ingreso: z.string().nullish(),
  email: z.string().email('Formato de email inválido').nullish(),
  id_pais: z.string().nullish(),
  id_provincia: z.number().int().positive().nullish(),
  id_municipio: z.number().int().positive().nullish(),
  id_ciudad: z.number().int().positive().nullish(),
  desc_direccion: z.string().nullish(),
  fecha_nacimiento: z.coerce.date().nullish(),
  estado: z.string().min(1, 'El estado es requerido'),
})

export const EntityFilterSchema = EntitySchema.partial()

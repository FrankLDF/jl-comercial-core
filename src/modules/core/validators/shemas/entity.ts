import z from 'zod'

export const EntitySchema = z.object({
  ID: z.number().int().positive().optional(),
  TIPO_ENTIDAD: z.string().min(1, 'El tipo de entidad es requerido'),
  TIPO_DOC_IDENT: z
    .number()
    .int()
    .positive('El tipo de documento de identidad es requerido'),
  DOCUMENTO_IDENT: z.string().min(1, 'El documento de identidad es requerido'),
  NOMBRES: z.string().min(1, 'Los nombres son requeridos'),
  APELLIDOS: z.string().nullish(),
  SEXO: z.string().nullish(),
  ESTADO_CIVIL: z.string().nullish(),
  TELEFONO: z.string().nullish(),
  TIPO_EMPELO: z.string().nullish(),
  NOMBRE_EMPRESA_TRABAJO: z.string().nullish(),
  OCUPACION: z.string().nullish(),
  POSICION_EMPRESA: z.string().nullish(),
  MONEDA_INGRESO: z.string().nullish(),
  INGRESO_PROMEDIO: z.number().nullish(),
  OTRO_INGRESO: z.number().nullish(),
  RAZON_OTRO_INGRESO: z.string().nullish(),
  EMAIL: z.string().email('Formato de email inválido').nullish(),
  ID_PAIS: z.string().nullish(),
  ID_PROVINCIA: z.number().int().positive().nullish(),
  ID_MUNICIPIO: z.number().int().positive().nullish(),
  ID_CIUDAD: z.number().int().positive().nullish(),
  DESC_DIRECCION: z.string().nullish(),
  FECHA_NACIMIENTO: z.coerce.date().nullish(),
  ESTADO: z.string().min(1, 'El estado es requerido'),
  FECHA_INSERCION: z.coerce.date().optional(),
  USUARIO_INSERCION: z.string().optional(),
  FECHA_ACTUALIZACION: z.coerce.date().nullish(),
  USUARIO_ACTUALIZACION: z.string().nullish(),
})

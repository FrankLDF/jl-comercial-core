export interface UserLoged {
  username: string
}
export interface PaisCondition {
  ID?: string
  NACIONALIDDA?: string
  NOMBRE?: string
  ESTADO?: string
}

export interface ProvinceCondition {
  ID?: number
  ID_PAIS?: string
  NOMBRE?: string
  ESTADO?: string
}

export interface MunicipioCondition {
  ID?: number
  ID_PROVINCIA?: number
  NOMBRE?: string
  ESTADO?: string
}

export interface CiudadCondition {
  ID?: number
  ID_MUNICIPIO?: number
  NOMBRE?: string
  ESTADO?: string
}

export interface EntidadDto {
  ID?: number
  TIPO_ENTIDAD: string
  TIPO_DOC_IDENT: number
  DOCUMENTO_IDENT: string
  NOMBRES: string
  APELLIDOS?: string
  SEXO?: string
  ESTADO_CIVIL?: string
  TELEFONO?: string
  TIPO_EMPELO?: string
  NOMBRE_EMPRESA_TRABAJO?: string
  OCUPACION?: string
  POSICION_EMPRESA?: string
  MONEDA_INGRESO?: string
  INGRESO_PROMEDIO?: number
  OTRO_INGRESO?: number
  RAZON_OTRO_INGRESO?: string
  EMAIL?: string
  ID_PAIS?: string
  ID_PROVINCIA?: number
  ID_MUNICIPIO?: number
  ID_CIUDAD?: number
  DESC_DIRECCION?: string
  FECHA_NACIMIENTO?: Date
  ESTADO: string
}

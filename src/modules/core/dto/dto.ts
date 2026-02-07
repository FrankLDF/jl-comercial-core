export interface UserLoged {
  username: string
}
export interface PaisCondition {
  id?: string
  nacionalidad?: string
  nombre?: string
  estado?: string
}

export interface ProvinceCondition {
  id?: number
  id_pais?: string
  nombre?: string
  estado?: string
}

export interface MunicipioCondition {
  id?: number
  id_provincia?: number
  nombre?: string
  estado?: string
}

export interface CiudadCondition {
  id?: number
  id_municipio?: number
  nombre?: string
  estado?: string
}

export interface EntidadDto {
  id?: number
  tipo_entidad: string
  tipo_doc_ident: number
  documento_ident: string
  nombres: string
  apellidos?: string
  sexo?: string
  estado_civil?: string
  telefono?: string
  tipo_empleo?: string
  nombre_empresa_trabajo?: string
  ocupacion?: string
  posicion_empresa?: string
  moneda_ingreso?: string
  ingreso_promedio?: number
  otro_ingreso?: number
  razon_otro_ingreso?: string
  email?: string
  id_pais?: string
  id_provincia?: number
  id_municipio?: number
  id_ciudad?: number
  desc_direccion?: string
  fecha_nacimiento?: Date
  estado: string
}

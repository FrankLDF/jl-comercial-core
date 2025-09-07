import { EntidadDto } from '../../core/dto/dto.js'

export interface ClientDto {
  ENTIDAD?: EntidadDto
  ID?: number
  ID_ENTIDAD?: number
  ESTADO?: string
  FECHA_INSERCION?: Date
  USUARIO_INSERCION: string
  FECHA_ACTUALIZACION?: Date
  USUARIO_ACTUALIZACION?: string
}

export interface ClientCondition {
  CLIENTE: ClientDto
  ENTIDAD: EntidadDto
}

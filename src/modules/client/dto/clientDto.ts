import { EntidadDto } from '../../core/dto/dto.js'

export interface ClientDto {
  ID?: number
  ESTADO?: string
  ENTIDAD?: EntidadDto
}

export interface ClientCondition {
  CLIENTE?: ClientDto
  ENTIDAD?: EntidadDto
}

import { EntidadDto } from '../../core/dto/dto.js'

export interface ClientDto {
  id?: number
  estado?: string
  entidad?: EntidadDto
}

export interface ClientCondition {
  cliente?: ClientDto
  entidad?: EntidadDto
}

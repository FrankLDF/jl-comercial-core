import { EntidadDto } from '../../core/dto/dto'

export interface PersonalDto {
  id?: number
  id_puesto?: number
  estado?: string
  entidad?: EntidadDto
}

export interface PersonalCondition {
  personal?: PersonalDto
  entidad?: EntidadDto
}

import { EntidadDto } from '../../core/dto/dto.js'

export interface ProveedorDto {
  id?: number
  estado?: string
  entidad?: Partial<EntidadDto>
}

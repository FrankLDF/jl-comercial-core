export interface CreateUserDto {
  id?: number
  id_personal: number
  nombre_usuario: string
  password: string
  estado?: string
}

export interface LoginDto {
  nombre_usuario: string
  password: string
}

export interface UserResponseDto {
  id: number
  id_personal: number
  nombre_usuario: string
  estado: string
  fecha_insercion: Date
  fecha_actualizacion?: Date
}

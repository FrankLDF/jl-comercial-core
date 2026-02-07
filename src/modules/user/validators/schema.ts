import z from 'zod'

export const UserCreateSchema = z.object({
  id_personal: z.number().int().positive('ID de personal requerido'),
  nombre_usuario: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  estado: z.string().optional().default('A'),
})

export const LoginSchema = z.object({
  nombre_usuario: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const UserUpdateSchema = z.object({
  id: z.number().int().positive(),
  nombre_usuario: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  estado: z.string().optional(),
})

export type UserCreateDto = z.infer<typeof UserCreateSchema>
export type LoginDto = z.infer<typeof LoginSchema>
export type UserUpdateDto = z.infer<typeof UserUpdateSchema>

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors?: any
}

export const successResponse = <T>(
  data: T,
  message = 'Operación exitosa'
): ApiResponse<T> => ({
  success: true,
  message,
  data,
})

export const errorResponse = (
  message: string,
  errors?: any
): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  errors,
})

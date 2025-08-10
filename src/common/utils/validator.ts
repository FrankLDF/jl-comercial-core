import z, { type ZodObject, type SafeParseReturnType } from 'zod'

export function validateFull<T extends ZodObject<any>>(
  schema: T,
  input: unknown
): SafeParseReturnType<z.infer<T>, unknown> {
  return schema.safeParse(input)
}

export function validatePartial<T extends ZodObject<any>>(
  schema: T,
  input: unknown
): SafeParseReturnType<Partial<z.infer<T>>, unknown> {
  return schema.partial().safeParse(input)
}

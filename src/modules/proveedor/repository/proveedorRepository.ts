import { Prisma, PrismaClient } from '@prisma/client'
import { ProveedorDto } from '../dto/proveedorDto.js'

type PrismaExecutor = PrismaClient | Prisma.TransactionClient
export class ProveedorRepository {
  constructor(private prisma: PrismaExecutor) {}

  get(filter: any) {
    // Normalize keys to lowercase for robustness
    const normalizedFilter: any = {}
    for (const key in filter) {
      if (filter[key]) {
        normalizedFilter[key.toLowerCase()] = filter[key]
      }
    }

    const { id, estado, start_date, end_date, ...entidadFilters } = normalizedFilter

    const whereClause: Prisma.proveedorWhereInput = {
      ...(id && { id: Number(id) }),
      ...(estado && { estado }),
    }

    if (start_date || end_date) {
      whereClause.fecha_insercion = {
        ...(start_date && { gte: new Date(String(start_date)) }),
        ...(end_date && { lte: new Date(String(end_date)) }),
      }
    }

    if (Object.keys(entidadFilters).length > 0) {
      const entidadWhere: Prisma.entidadWhereInput = {}
      for (const [key, value] of Object.entries(entidadFilters)) {
        if (value) {
            // Using precise mapping for known string fields to allow insensitive contains
            if (['nombres', 'apellidos', 'documento_ident', 'email', 'telefono'].includes(key)) {
                 (entidadWhere as any)[key] = { contains: String(value), mode: 'insensitive' }
            } else if(['id', 'tipo_doc_ident', 'id_pais', 'id_provincia', 'id_municipio', 'id_ciudad'].includes(key)) {
                 // Fields that should be numeric or specific IDs
                 (entidadWhere as any)[key] = isNaN(Number(value)) ? value : Number(value)
            } else if (['tipo_entidad', 'sexo', 'estado_civil', 'tipo_empleo', 'nombre_empresa_trabajo', 'ocupacion', 'posicion_empresa', 'moneda_ingreso'].includes(key)) {
                 // Other known fields in entidad model
                 (entidadWhere as any)[key] = value
            }
            // Unknown fields are ignored to prevent Prisma errors
        }
      }
      
      if (Object.keys(entidadWhere).length > 0) {
        whereClause.entidad = entidadWhere
      }
    }

    return this.prisma.proveedor.findMany({
      where: whereClause,
      include: { entidad: true },
      orderBy: {
        entidad: { nombres: 'asc' },
      },
    })
  }

  async upsert(data: ProveedorDto, user: string) {
    if (!data.id) {
      return this.create(data, user)
    }

    return this.update(data.id, data, user)
  }

  private create(data: ProveedorDto, user: string) {
    const proveedorData: any = {
      estado: data.estado ?? 'A',
      usuario_insercion: user,
    }

    if (data.entidad) {
      proveedorData.entidad = data.entidad.id
        ? {
            connect: {
              id: data.entidad.id,
            },
          }
        : {
            create: {
              ...data.entidad,
              usuario_insercion: user,
            },
          }
    }

    return this.prisma.proveedor.create({
      data: proveedorData,
      include: { entidad: true },
    })
  }

  private update(id: number, data: ProveedorDto, user: string) {
    const { id: entidadId, fecha_insercion, usuario_insercion, ...entidadUpdateData } = (data.entidad as any) || {}

    return this.prisma.proveedor.update({
      where: { id: id },
      data: {
        ...(data.estado && { estado: data.estado }),

        usuario_actualizacion: user,

        entidad: data.entidad
          ? {
              update: {
                ...entidadUpdateData,
                usuario_actualizacion: user,
              },
            }
          : undefined,
      },
      include: { entidad: true },
    })
  }
}

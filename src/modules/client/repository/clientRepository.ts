import { Prisma, PrismaClient } from '@prisma/client'
import { ClientDto } from '../dto/clientDto.js'

type PrismaExecutor = PrismaClient | Prisma.TransactionClient
export class ClientRepository {
  constructor(private prisma: PrismaExecutor) {}

  get(filter: ClientDto) {
    return this.prisma.cliente.findMany({
      where: {
        ...filter,
      },
      include: { entidad: true },
      orderBy: {
        entidad: { nombres: 'asc' },
      },
    })
  }

  async upsert(data: ClientDto, user: string) {
    if (!data.id) {
      return this.create(data, user)
    }

    return this.update(data.id, data, user)
  }

  private create(data: ClientDto, user: string) {
    const clienteData: any = {
      estado: data.estado ?? 'A',
      usuario_insercion: user,
    }

    if (data.entidad) {
      clienteData.entidad = data.entidad.id
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

    return this.prisma.cliente.create({
      data: clienteData,
      include: { entidad: true },
    })
  }

  private update(id: number, data: ClientDto, user: string) {
    return this.prisma.cliente.update({
      where: { id: id },
      data: {
        ...(data.estado && { estado: data.estado }),

        usuario_actualizacion: user,

        entidad: data.entidad
          ? {
              update: {
                ...data.entidad,
                usuario_actualizacion: user,
              },
            }
          : undefined,
      },
      include: { entidad: true },
    })
  }
}

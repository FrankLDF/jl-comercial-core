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
      include: { ENTIDAD: true },
      orderBy: {
        ENTIDAD: { NOMBRES: 'asc' },
      },
    })
  }

  async upsert(data: ClientDto, user: string) {
    if (!data.ID) {
      return this.create(data, user)
    }

    return this.update(data.ID, data, user)
  }

  private create(data: ClientDto, user: string) {
    const clienteData: any = {
      ESTADO: data.ESTADO ?? 'A',
      USUARIO_INSERCION: user,
    }

    if (data.ENTIDAD) {
      clienteData.ENTIDAD = data.ENTIDAD.ID
        ? {
            connect: {
              ID: data.ENTIDAD.ID,
            },
          }
        : {
            create: {
              ...data.ENTIDAD,
              USUARIO_INSERCION: user,
            },
          }
    }

    return this.prisma.cliente.create({
      data: clienteData,
      include: { ENTIDAD: true },
    })
  }

  private update(id: number, data: ClientDto, user: string) {
    return this.prisma.cliente.update({
      where: { ID: id },
      data: {
        ...(data.ESTADO && { ESTADO: data.ESTADO }),

        USUARIO_ACTUALIZACION: user,

        ENTIDAD: data.ENTIDAD
          ? {
              update: {
                ...data.ENTIDAD,
                USUARIO_ACTUALIZACION: user,
              },
            }
          : undefined,
      },
      include: { ENTIDAD: true },
    })
  }
}

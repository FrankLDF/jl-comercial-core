import { Prisma, PrismaClient } from '@prisma/client'
import { PersonalDto } from '../dto/personalDto.js'

type PrismaExecutor = PrismaClient | Prisma.TransactionClient

export class PersonalRepository {
  constructor(private prisma: PrismaExecutor) {}

  get(filter: PersonalDto) {
    return this.prisma.personal.findMany({
      where: {
        ...filter,
      },
      include: {
        entidad: true,
        puesto: true,
        usuario: true,
      },
      orderBy: {
        entidad: { nombres: 'asc' },
      },
    })
  }

  getOne(filter: PersonalDto) {
    return this.prisma.personal.findFirst({
      where: {
        ...filter,
      },
      include: {
        entidad: true,
        puesto: true,
        usuario: true,
      },
    })
  }

  async upsert(data: PersonalDto, user: string) {
    if (!data.id) {
      return this.create(data, user)
    }

    return this.update(data.id, data, user)
  }

  private create(data: PersonalDto, user: string) {
    const personalData: any = {
      estado: data.estado ?? 'A',
      usuario_insercion: user,
    }

    // Conectar puesto si existe
    if (data.id_puesto) {
      personalData.puesto = {
        connect: {
          id: data.id_puesto,
        },
      }
    }

    // Manejar entidad
    if (data.entidad) {
      personalData.entidad = data.entidad.id
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

    return this.prisma.personal.create({
      data: personalData,
      include: {
        entidad: true,
        puesto: true,
      },
    })
  }

  private update(id: number, data: PersonalDto, user: string) {
    return this.prisma.personal.update({
      where: { id: id },
      data: {
        ...(data.estado && { estado: data.estado }),
        ...(data.id_puesto && {
          puesto: {
            connect: {
              id: data.id_puesto,
            },
          },
        }),
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
      include: {
        entidad: true,
        puesto: true,
      },
    })
  }
}

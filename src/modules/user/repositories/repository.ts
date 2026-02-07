import { Prisma, usuario, PrismaClient } from '@prisma/client'

type PrismaExecutor = PrismaClient | Prisma.TransactionClient

export class UserRepository {
  constructor(private prisma: PrismaExecutor) {}

  async getAll(condition?: Prisma.usuarioFindManyArgs): Promise<usuario[]> {
    return await this.prisma.usuario.findMany({
      ...condition,
      include: {
        personal: {
          include: {
            entidad: true,
            puesto: true,
          },
        },
        rol: {
          include: {
            rol: true,
          },
        },
      },
    })
  }

  async getOne(condition: Prisma.usuarioWhereInput): Promise<usuario | null> {
    return await this.prisma.usuario.findFirst({
      where: condition,
      include: {
        personal: {
          include: {
            entidad: true,
            puesto: true,
          },
        },
        rol: {
          include: {
            rol: true,
          },
        },
      },
    })
  }

  async create(data: Prisma.usuarioUncheckedCreateInput): Promise<usuario> {
    return await this.prisma.usuario.create({
      data,
      include: {
        personal: {
          include: {
            entidad: true,
            puesto: true,
          },
        },
      },
    })
  }

  async update(id: number, data: Prisma.usuarioUpdateInput): Promise<usuario> {
    return await this.prisma.usuario.update({
      where: { id: id },
      data,
      include: {
        personal: {
          include: {
            entidad: true,
            puesto: true,
          },
        },
      },
    })
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.usuario.count({
      where: {
        nombre_usuario: username,
      },
    })
    return count > 0
  }

  async existsByPersonalId(personalId: number): Promise<boolean> {
    const count = await this.prisma.usuario.count({
      where: {
        id_personal: personalId,
      },
    })
    return count > 0
  }
}

import { Prisma, Usuario } from '@prisma/client'
import prisma from '../../../config/prismaConnect.js'

export class UserRepository {
  async getAll(condition?: Prisma.UsuarioFindManyArgs): Promise<Usuario[]> {
    return await prisma.usuario.findMany(condition)
  }

  async getOne(condition: object): Promise<Usuario | null> {
    return await prisma.usuario.findFirst({ where: condition })
  }

  async create(data: Prisma.UsuarioUncheckedCreateInput): Promise<Usuario> {
    return await prisma.usuario.create({ data })
  }

  async update(id: number, data: Prisma.UsuarioUpdateInput): Promise<Usuario> {
    return await prisma.usuario.update({
      where: { ID: id },
      data,
    })
  }
}

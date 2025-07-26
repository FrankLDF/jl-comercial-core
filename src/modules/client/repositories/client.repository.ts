import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ClienteRepository {
  async getAll() {
    return await prisma.cliente.findMany()
  }
}

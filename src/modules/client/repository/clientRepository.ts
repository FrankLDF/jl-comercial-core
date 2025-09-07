import { Cliente, Prisma } from '@prisma/client'
import {
  TxClient,
  UpsertCondition,
} from '../../core/repositories/repositories.js'
import { ClientDto } from '../dto/clientDto.js'
import { UserLoged } from '../../core/dto/dto.js'

export class ClientRepository {
  async getClient(
    tx: TxClient,
    condition: ClientDto,
    order: 'asc' | 'desc' = 'asc'
  ): Promise<Cliente[] | Error> {
    try {
      return await tx.cliente.findMany({
        where: condition,
        include: {
          ENTIDAD: true,
        },
        orderBy: {
          ENTIDAD: {
            NOMBRES: order,
          },
        },
      })
    } catch (error) {
      return error as Error
    }
  }
  async upsertClient(
    tx: TxClient,
    condition: ClientDto,
    user: UserLoged
  ): Promise<Cliente | Error> {
    try {
      if (!condition?.ID) {
        return await tx.cliente.create({
          data: { ...condition, USUARIO_INSERCION: user.username },
        })
      }

      return await tx.cliente.upsert({
        where: { ID: condition?.ID },
        create: { ...condition, USUARIO_INSERCION: user.username },
        update: { ...condition, USUARIO_ACTUALIZACION: user.username },
      })
    } catch (error) {
      return error as Error
    }
  }
}

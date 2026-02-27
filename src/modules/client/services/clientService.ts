import prisma from '../../../config/prismaConnect.js'
import { UserLoged } from '../../core/dto/dto.js'
import { ClientDto } from '../dto/clientDto.js'
import { ClientRepository } from '../repository/clientRepository.js'
import { ClientUpsertSchema } from '../validator/schema.js'

export class ClientService {
  async upsert(payload: ClientDto, user: UserLoged) {
    return prisma.$transaction(async (tx) => {
      const repo = new ClientRepository(tx)
      const validPayload = ClientUpsertSchema.parse(payload)

      const cliente = await repo.upsert(validPayload, user.username)

      return cliente
    })
  }

  async get(filter: any) {
    const repo = new ClientRepository(prisma)
    return repo.get(filter)
  }
}

import prisma from '../../../config/prismaConnect.js'
import { EntidadDto, UserLoged } from '../../core/dto/dto.js'
import { GeneralRepository } from '../../core/repositories/repositories.js'
import { ClientCondition, ClientDto } from '../dto/clientDto.js'
import { ClientRepository } from '../repository/clientRepository.js'

const _generalRepo = new GeneralRepository()
const _clientRepo = new ClientRepository()
export class ClientService {
  async upertClient(data: ClientCondition, user: UserLoged) {
    try {
      return prisma.$transaction(async (tx) => {
        const EntityInserted = await _generalRepo.upsertEntity(
          tx,
          data.ENTIDAD as EntidadDto,
          user
        )
        if (EntityInserted instanceof Error) {
          throw EntityInserted
        }

        const ClientCondition = {
          ID: data.CLIENTE?.ID || undefined,
          ID_ENTIDAD: EntityInserted.ID,
          ESTADO: EntityInserted.ESTADO,
          USUARIO_INSERCION: EntityInserted.USUARIO_INSERCION,
        }

        const clientData = await _clientRepo.upsertClient(
          tx,
          ClientCondition,
          user
        )
        if (clientData instanceof Error) {
          throw clientData
        }

        return clientData
      })
    } catch (error) {
      return error
    }
  }
  async getClient(condition: ClientDto) {
    try {
      return prisma.$transaction(async (tx) => {
        const clientData = await _clientRepo.getClient(tx, condition)
        return clientData
      })
    } catch (error) {
      return error
    }
  }
}

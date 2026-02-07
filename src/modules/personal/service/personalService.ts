import prisma from '../../../config/prismaConnect.js'
import { UserLoged } from '../../core/dto/dto.js'
import { PersonalDto } from '../dto/personalDto.js'
import { PersonalRepository } from '../repository/personalRepository.js'
import { PersonalUpsertSchema } from '../validators/personalSchema.js'

export class PersonalService {
  async upsert(payload: PersonalDto, user: UserLoged) {
    return prisma.$transaction(async (tx) => {
      const repo = new PersonalRepository(tx)
      const validPayload = PersonalUpsertSchema.parse(payload)

      const personal = await repo.upsert(validPayload, user.username)

      return personal
    })
  }

  async get(filter: PersonalDto) {
    const repo = new PersonalRepository(prisma)
    return repo.get(filter)
  }

  async getOne(filter: PersonalDto) {
    const repo = new PersonalRepository(prisma)
    return repo.getOne(filter)
  }
}

import prisma from '../../../config/prismaConnect.js'
import { UserLoged } from '../../core/dto/dto.js'
import { ProveedorDto } from '../dto/proveedorDto.js'
import { ProveedorRepository } from '../repository/proveedorRepository.js'
import { ProveedorUpsertSchema } from '../validator/schema.js'

export class ProveedorService {
  async upsert(payload: ProveedorDto, user: UserLoged) {
    return prisma.$transaction(async (tx) => {
      const repo = new ProveedorRepository(tx)
      const validPayload = ProveedorUpsertSchema.parse(payload)

      const proveedor = await repo.upsert(validPayload, user.username)

      return proveedor
    })
  }

  async get(filter: any) {
    const repo = new ProveedorRepository(prisma)
    return repo.get(filter)
  }
}

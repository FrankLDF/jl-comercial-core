import prisma from '../../../config/prismaConnect.js'
import {
  CiudadCondition,
  MunicipioCondition,
  PaisCondition,
  ProvinceCondition,
} from '../dto/dto.js'
import { GeneralRepository } from '../repositories/repositories.js'

const _generalRepo = new GeneralRepository()
export class generalService {
  async getCountry(condition: PaisCondition) {
    return await _generalRepo.getCountry(prisma, {
      where: { ...condition },
    })
  }
  async getProvince(condition: ProvinceCondition) {
    return await _generalRepo.getProvince(prisma, {
      where: { ...condition },
    })
  }
  async getMunicipe(condition: MunicipioCondition) {
    return await _generalRepo.getMunicipe(prisma, {
      where: { ...condition },
    })
  }
  async getSector(condition: CiudadCondition) {
    return await _generalRepo.getSector(prisma, {
      where: { ...condition },
    })
  }
}

import prisma from '../../../config/prismaConnect.js'
import {
  CiudadCondition,
  ColorCondition,
  EstiloCondition,
  MarcaCondition,
  ModeloCondition,
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
  async getMarca(condition: MarcaCondition) {
    return await _generalRepo.getMarca(prisma, {
      where: { ...condition },
    })
  }
  async getModelo(condition: ModeloCondition) {
    return await _generalRepo.getModelo(prisma, {
      where: { ...condition },
    })
  }
  async getEstilo(condition: EstiloCondition) {
    return await _generalRepo.getEstilo(prisma, {
      where: { ...condition },
    })
  }
  async getColor(condition: ColorCondition) {
    return await _generalRepo.getColor(prisma, {
      where: { ...condition },
    })
  }
}

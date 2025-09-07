import {
  Ciudad,
  Entidad,
  Municipio,
  Pais,
  Prisma,
  Provincia,
} from '@prisma/client'
import { PrismaClient } from '@prisma/client/extension'
import { EntidadDto, UserLoged } from '../dto/dto.js'

export type TxClient = PrismaClient | Prisma.TransactionClient

export interface UpsertCondition<T> {
  where: Prisma.Args<T, 'findUnique'>['where']
  create: Prisma.Args<T, 'create'>['data']
  update: Prisma.Args<T, 'update'>['data']
}

export class GeneralRepository {
  async getCountry(
    tx: TxClient,
    condition: Prisma.PaisFindManyArgs
  ): Promise<Pais[] | Error> {
    return await tx.pais.findMany(condition)
  }
  async getProvince(
    tx: TxClient,
    condition: Prisma.ProvinciaFindManyArgs
  ): Promise<Provincia[] | Error> {
    return await tx.provincia.findMany(condition)
  }
  async getMunicipe(
    tx: TxClient,
    condition: Prisma.MunicipioFindManyArgs
  ): Promise<Municipio[] | Error> {
    return await tx.municipio.findMany(condition)
  }
  async getSector(
    tx: TxClient,
    condition: Prisma.CiudadFindManyArgs
  ): Promise<Ciudad[] | Error> {
    return await tx.ciudad.findMany(condition)
  }
  async getEntity(
    tx: TxClient,
    condition: Prisma.EntidadFindManyArgs
  ): Promise<Entidad[] | Error> {
    return await tx.entidad.findMany(condition)
  }
  async upsertEntity(
    tx: TxClient,
    condition: EntidadDto,
    user: UserLoged
  ): Promise<Entidad | Error> {
    try {
      if (!condition?.ID) {
        return await tx.entidad.create({
          data: { ...condition, USUARIO_INSERCION: user.username },
        })
      }

      return await tx.entidad.upsert({
        where: { ID: condition?.ID },
        create: { ...condition, USUARIO_INSERCION: user.username },
        update: { ...condition, USUARIO_ACTUALIZACION: user.username },
      })
    } catch (error) {
      return error as Error
    }
  }
}

import {
  ciudad,
  entidad,
  municipio,
  pais,
  Prisma,
  provincia,
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
    condition: Prisma.paisFindManyArgs,
  ): Promise<pais[] | Error> {
    return await tx.pais.findMany(condition)
  }
  async getProvince(
    tx: TxClient,
    condition: Prisma.provinciaFindManyArgs,
  ): Promise<provincia[] | Error> {
    return await tx.provincia.findMany(condition)
  }
  async getMunicipe(
    tx: TxClient,
    condition: Prisma.municipioFindManyArgs,
  ): Promise<municipio[] | Error> {
    return await tx.municipio.findMany(condition)
  }
  async getSector(
    tx: TxClient,
    condition: Prisma.ciudadFindManyArgs,
  ): Promise<any> {
    return await tx.ciudad.findMany(condition)
  }
  async getMarca(
    tx: TxClient,
    condition: Prisma.marcaFindManyArgs,
  ): Promise<any> {
    return await tx.marca.findMany(condition)
  }
  async getModelo(
    tx: TxClient,
    condition: Prisma.modeloFindManyArgs,
  ): Promise<any> {
    return await tx.modelo.findMany(condition)
  }
  async getEstilo(
    tx: TxClient,
    condition: Prisma.estiloFindManyArgs,
  ): Promise<any> {
    return await tx.estilo.findMany(condition)
  }
  async getColor(
    tx: TxClient,
    condition: Prisma.colorFindManyArgs,
  ): Promise<any> {
    return await tx.color.findMany(condition)
  }
  async getEntity(
    tx: TxClient,
    condition: Prisma.entidadFindManyArgs,
  ): Promise<entidad[] | Error> {
    return await tx.entidad.findMany(condition)
  }
  async upsertEntity(
    tx: TxClient,
    condition: EntidadDto,
    user: UserLoged,
  ): Promise<entidad | Error> {
    try {
      if (!condition?.id) {
        return await tx.entidad.create({
          data: { ...condition, usuario_insercion: user.username },
        })
      }

      return await tx.entidad.upsert({
        where: { id: condition?.id },
        create: { ...condition, usuario_insercion: user.username },
        update: { ...condition, usuario_actualizacion: user.username },
      })
    } catch (error) {
      return error as Error
    }
  }
}

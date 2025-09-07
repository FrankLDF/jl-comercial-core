import { Request, Response } from 'express'
import { ClientService } from '../services/clientService.js'
import { SafeParseReturnType } from 'zod'
import {
  validateFull,
  validatePartial,
} from '../../../common/utils/validator.js'
import { ClientSchema, ClientWithEntitySchema } from '../validator/schema.js'
import { EntidadDto, UserLoged } from '../../core/dto/dto.js'
import { EntitySchema } from '../../core/validators/shemas/entity.js'
import { ClientCondition, ClientDto } from '../dto/clientDto.js'
const _clientService = new ClientService()
export class ClientController {
  async upsertClient(req: Request, res: Response) {
    try {
      const data: ClientCondition = req.body
      const user = req.user as UserLoged
      let dataClientValid = {} as ClientDto

      const validationEntity: SafeParseReturnType<EntidadDto, unknown> =
        validateFull(EntitySchema, data.ENTIDAD)

      if (!validationEntity.success) {
        console.log(validationEntity.error.format())
        return res.status(400).json({ errors: validationEntity.error.format() })
      }
      const dataEntityValid = validationEntity.data as EntidadDto

      if (data.CLIENTE) {
        const validationClient: SafeParseReturnType<ClientDto, unknown> =
          validateFull(ClientSchema, data.CLIENTE)
        if (!validationClient.success) {
          console.log(validationClient.error.format())
          return res
            .status(400)
            .json({ errors: validationClient.error.format() })
        }
        dataClientValid = validationClient.data as ClientDto
      }

      const result = await _clientService.upertClient(
        { CLIENTE: dataClientValid, ENTIDAD: dataEntityValid },
        user
      )

      if (result instanceof Error) {
        return res.status(400).json({ error: result.message })
      }

      return res.status(200).json(result)
    } catch (error: any) {
      console.log('error en upsertClient' + error)
      return res.status(500).json({ error: error.message })
    }
  }

  async getClient(req: Request, res: Response) {
    try {
      const data = req.body

      //   const validation: SafeParseReturnType<ClientDto, unknown> =
      //     validatePartial(ClientWithEntitySchema, data)

      //   if (!validation.success) {
      //     console.log(validation.error.format())
      //     return res.status(400).json({ errors: validation.error.format() })
      //   }

      //   const dataValid = validation.data as ClientDto
      //   console.log({ dataValid })
      const result = await _clientService.getClient(data)

      if (result instanceof Error) {
        return res.status(400).json({ error: result.message })
      }

      return res.status(200).json(result)
    } catch (error: any) {
      console.log('error en getClient' + error)
      return res.status(500).json({ error: error.message })
    }
  }
}

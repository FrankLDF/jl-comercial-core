import { Request, Response } from 'express'
import { generalService } from '../services/services.js'
import { EstatusGeneral } from '../../../common/utils/constant.js'

const _generalService = new generalService()
export class generalController {
  getCounry = async (req: Request, res: Response) => {
    const countries = await _generalService.getCountry({
      ESTADO: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ countries })
  }
  getProvince = async (req: Request, res: Response) => {
    const province = await _generalService.getProvince({
      ESTADO: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ province })
  }
  getMunicip = async (req: Request, res: Response) => {
    const municip = await _generalService.getMunicipe({
      ESTADO: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ municip })
  }
  getSector = async (req: Request, res: Response) => {
    const sector = await _generalService.getSector({
      ESTADO: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ sector })
  }
}

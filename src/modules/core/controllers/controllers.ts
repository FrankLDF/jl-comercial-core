import { Request, Response } from 'express'
import { generalService } from '../services/services.js'
import { EstatusGeneral } from '../../../common/utils/constant.js'

const _generalService = new generalService()
export class generalController {
  getCounry = async (req: Request, res: Response) => {
    const countries = await _generalService.getCountry({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ countries })
  }
  getProvince = async (req: Request, res: Response) => {
    const province = await _generalService.getProvince({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ province })
  }
  getMunicip = async (req: Request, res: Response) => {
    const municip = await _generalService.getMunicipe({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ municip })
  }
  getSector = async (req: Request, res: Response) => {
    const sector = await _generalService.getSector({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ sector })
  }
  getMarca = async (req: Request, res: Response) => {
    const brands = await _generalService.getMarca({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ brands })
  }
  getModelo = async (req: Request, res: Response) => {
    const { id_marca } = req.query
    const models = await _generalService.getModelo({
      estado: EstatusGeneral.ACTIVO,
      id_marca: id_marca ? Number(id_marca) : undefined,
    })
    return res.status(200).json({ models })
  }
  getEstilo = async (req: Request, res: Response) => {
    const { id_modelo } = req.query
    const styles = await _generalService.getEstilo({
      estado: EstatusGeneral.ACTIVO,
      id_modelo: id_modelo ? Number(id_modelo) : undefined,
    })
    return res.status(200).json({ styles })
  }
  getColor = async (req: Request, res: Response) => {
    const colors = await _generalService.getColor({
      estado: EstatusGeneral.ACTIVO,
    })
    return res.status(200).json({ colors })
  }
}

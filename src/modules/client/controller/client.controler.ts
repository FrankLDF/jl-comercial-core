import { Request, Response } from 'express'
import { ClienteService } from '../services/client.servic.js'

const clienteService = new ClienteService()

export class ClienteController {
  async listarClientes(req: Request, res: Response) {
    const clientes = await clienteService.obtenerClientes()
    return res.json(clientes)
  }
}

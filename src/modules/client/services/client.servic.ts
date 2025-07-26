import { ClienteRepository } from '../repositories/client.repository.js'

const clienteRepository = new ClienteRepository()

export class ClienteService {
  async obtenerClientes() {
    return await clienteRepository.getAll()
  }
}

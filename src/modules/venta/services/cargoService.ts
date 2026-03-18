import prisma from '../../../config/prismaConnect.js';
import { AppError } from '../../../common/errors/AppError.js';

export class CargoService {
  async listarTiposCargos() {
    return prisma.cargo_tipo.findMany({
      where: { estado: 'A' },
      orderBy: { nombre: 'asc' }
    });
  }

  async crearTipoCargo(data: { nombre: string; monto_sugerido: number; es_vinculante?: boolean }, usuario: string) {
    return prisma.cargo_tipo.create({
      data: {
        ...data,
        usuario_insercion: usuario
      }
    });
  }

  async actualizarTipoCargo(id: number, data: any, usuario: string) {
    return prisma.cargo_tipo.update({
      where: { id },
      data: {
        ...data,
        usuario_actualizacion: usuario
      }
    });
  }
}

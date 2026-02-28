import prisma from '../../../config/prismaConnect.js';

export class InventarioService {
  async list(filters: any) {
    const { id_marca, id_modelo, id_estilo, id_color, condicion, chasis, placa, start_date, end_date } = filters;

    const whereClause: any = {
      estado_ingreso: 'EN_STOCK',
      estado: 'A',
      condicion: condicion || undefined,
      vehiculo: {
        id_marca: id_marca ? Number(id_marca) : undefined,
        id_modelo: id_modelo ? Number(id_modelo) : undefined,
        id_estilo: id_estilo ? Number(id_estilo) : undefined,
        id_color: id_color ? Number(id_color) : undefined,
        chasis: chasis ? { contains: String(chasis), mode: 'insensitive' } : undefined,
        placa: placa ? { contains: String(placa), mode: 'insensitive' } : undefined,
      }
    };

    if (start_date || end_date) {
      whereClause.fecha_ingreso = {
        ...(start_date && { gte: new Date(String(start_date)) }),
        ...(end_date && { lte: new Date(String(end_date)) }),
      };
    }

    return await prisma.vehiculo_ingreso.findMany({
      where: whereClause,
      include: {
        vehiculo: {
          include: {
            marca_ref: true,
            modelo_ref: true,
            estilo_ref: true,
            color_ref: true
          }
        }
      },
      orderBy: { fecha_ingreso: 'desc' }
    });
  }
}

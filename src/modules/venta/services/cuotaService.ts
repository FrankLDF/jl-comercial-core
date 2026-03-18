import { Decimal } from '@prisma/client/runtime/library';
import { AppError } from '../../../common/errors/AppError.js';

export class CuotaService {
  async generarCuotas(id_venta: number, monto_total: number, inicial: number, cantidad_cuotas: number, tasa_interes: number, usuario: string, tx: any) {
    const capital_financiar = new Decimal(monto_total).minus(new Decimal(inicial));
    
    if (capital_financiar.lte(0)) {
      throw new AppError('El inicial no puede ser mayor o igual al monto total en una venta a crédito.', 400);
    }

    if (cantidad_cuotas <= 0) {
      throw new AppError('La cantidad de cuotas debe ser mayor a 0.', 400);
    }

    // Fórmula: Interés Simple Distribuido
    // Interés Total = Capital * (Tasa / 100)
    // Monto Total = Capital + Interés Total
    // Cuota = Monto Total / Cantidad
    const tasa_decimal = new Decimal(tasa_interes).div(100);
    const interes_total = capital_financiar.mul(tasa_decimal).toDecimalPlaces(2);
    const monto_total_con_interes = capital_financiar.plus(interes_total);
    const monto_cuota_base = monto_total_con_interes.div(cantidad_cuotas).toDecimalPlaces(2);
    
    let total_acumulado = new Decimal(0);

    for (let i = 1; i <= cantidad_cuotas; i++) {
      let monto_cuota = monto_cuota_base;

      // Ajuste en la última cuota para evitar diferencias por redondeo
      if (i === cantidad_cuotas) {
        monto_cuota = monto_total_con_interes.minus(total_acumulado);
      } else {
        total_acumulado = total_acumulado.plus(monto_cuota);
      }

      const fecha_vencimiento = new Date();
      fecha_vencimiento.setMonth(fecha_vencimiento.getMonth() + i);

      await tx.venta_cuota.create({
        data: {
          id_venta,
          numero_cuota: i,
          fecha_vencimiento,
          monto: monto_cuota,
          monto_pagado: 0,
          estado_cuota: 'PENDIENTE',
          estado: 'A',
          usuario_insercion: usuario
        }
      });
    }
  }

  async obtenerCuotasPorVenta(id_venta: number, tx: any = null) {
    const client = tx || (await import('../../../config/prismaConnect.js')).default;
    return client.venta_cuota.findMany({
      where: { id_venta, estado: 'A' },
      orderBy: { numero_cuota: 'asc' }
    });
  }

  async actualizarEstadoCuotasVencidas(usuario: string) {
    const prisma = (await import('../../../config/prismaConnect.js')).default;
    return prisma.venta_cuota.updateMany({
      where: {
        fecha_vencimiento: { lt: new Date() },
        estado_cuota: 'PENDIENTE',
        estado: 'A'
      },
      data: {
        estado_cuota: 'VENCIDA'
      }
    });
  }
}

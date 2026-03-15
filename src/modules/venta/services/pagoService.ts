import { Decimal } from '@prisma/client/runtime/library';
import { AppError } from '../../../common/errors/AppError.js';
import { RegistrarPagoDto } from '../validator/schema.js';

export class PagoService {
  async registrarPago(payload: RegistrarPagoDto, usuario: string, tx?: any) {
    const execute = async (t: any) => {
      // 1. Validar que la venta existe y su estado
      const venta = await t.venta.findUnique({
        where: { id: payload.id_venta },
        include: { cuotas: { where: { estado: 'A' }, orderBy: { numero_cuota: 'asc' } } }
      });

      if (!venta) throw new AppError('La venta especificada no existe.', 404);
      if (venta.estado_venta === 'CANCELADA') throw new AppError('No se pueden registrar pagos en una venta cancelada.', 400);
      if (venta.estado_venta === 'PAGADA') throw new AppError('Esta venta ya ha sido pagada en su totalidad.', 400);

      const saldoActual = new Decimal(venta.saldo_pendiente || 0);
      const montoPago = new Decimal(payload.monto_total);

      if (montoPago.gt(saldoActual)) {
        throw new AppError(`El monto del pago (${montoPago.toFixed(2)}) no puede ser mayor al saldo pendiente (${saldoActual.toFixed(2)}).`, 400);
      }

      // 2. Crear el registro del pago
      const pago = await t.pago_venta.create({
        data: {
          id_venta: payload.id_venta,
          monto_total: montoPago,
          metodo_pago: payload.metodo_pago,
          estado: 'A',
          usuario_insercion: usuario
        }
      });

      // 3. Aplicar el pago a las cuotas (Lógica FIFO)
      await this.aplicarPagoACuotas(pago.id, venta.id, montoPago, t);

      // 4. Actualizar el saldo de la venta
      const nuevoSaldo = saldoActual.minus(montoPago);
      const nuevoEstadoVenta = nuevoSaldo.lte(0) ? 'PAGADA' : 'ACTIVA';

      await t.venta.update({
        where: { id: venta.id },
        data: {
          saldo_pendiente: nuevoSaldo,
          estado_venta: nuevoEstadoVenta,
          usuario_actualizacion: usuario
        }
      });

      return pago;
    };

    return tx ? execute(tx) : (await import('../../../config/prismaConnect.js')).default.$transaction(execute);
  }

  async aplicarPagoACuotas(id_pago_venta: number, id_venta: number, monto_pago: Decimal, tx: any) {
    const cuotasPendientes = await tx.venta_cuota.findMany({
      where: {
        id_venta,
        estado_cuota: { in: ['PENDIENTE', 'VENCIDA'] },
        estado: 'A'
      },
      orderBy: { numero_cuota: 'asc' }
    });

    let montoRestante = monto_pago;

    for (const cuota of cuotasPendientes) {
      if (montoRestante.lte(0)) break;

      const montoDeudaCuota = new Decimal(cuota.monto).minus(new Decimal(cuota.monto_pagado));
      let montoAplicar = new Decimal(0);

      if (montoRestante.gte(montoDeudaCuota)) {
        // Paga la cuota completa
        montoAplicar = montoDeudaCuota;
        montoRestante = montoRestante.minus(montoDeudaCuota);
        
        await tx.venta_cuota.update({
          where: { id: cuota.id },
          data: {
            monto_pagado: new Decimal(cuota.monto),
            estado_cuota: 'PAGADA'
          }
        });
      } else {
        // Pago parcial de la cuota
        montoAplicar = montoRestante;
        
        await tx.venta_cuota.update({
          where: { id: cuota.id },
          data: {
            monto_pagado: new Decimal(cuota.monto_pagado).plus(montoRestante)
          }
        });
        
        montoRestante = new Decimal(0);
      }

      // Registrar la aplicación del pago
      await tx.pago_cuota_aplicacion.create({
        data: {
          id_pago_venta,
          id_venta_cuota: cuota.id,
          monto_aplicado: montoAplicar
        }
      });
    }
  }

  async obtenerPagosVenta(id_venta: number) {
    const prisma = (await import('../../../config/prismaConnect.js')).default;
    return prisma.pago_venta.findMany({
      where: { id_venta, estado: 'A' },
      include: { aplicaciones: { include: { venta_cuota: true } } },
      orderBy: { fecha_pago: 'desc' }
    });
  }
}

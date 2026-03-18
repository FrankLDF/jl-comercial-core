import { Decimal } from '@prisma/client/runtime/library';
import { AppError } from '../../../common/errors/AppError.js';
import { RegistrarPagoDto } from '../validator/schema.js';

export class PagoService {
  async registrarPago(payload: RegistrarPagoDto, usuario: string, tx?: any) {
    const execute = async (t: any) => {
      // 1. Validar que la venta existe
      const venta = await t.venta.findUnique({
        where: { id: payload.id_venta },
        include: { 
          cuotas: { where: { estado: 'A' } },
          cargos: { include: { cargo_tipo: true } }
        }
      });

      if (!venta) throw new AppError('La venta especificada no existe.', 404);
      if (venta.estado_venta === 'CANCELADA') throw new AppError('No se pueden registrar pagos en una venta cancelada.', 400);

      const totalDistribuido = payload.distribucion.reduce((sum, d) => sum + d.monto + (d.monto_mora || 0), 0);
      if (Math.abs(totalDistribuido - payload.monto_total) > 0.01) {
        throw new AppError(`El monto total (${payload.monto_total}) no coincide con la suma de la distribución (${totalDistribuido}).`, 400);
      }

      // 2. Crear el registro del pago
      const pago = await t.pago_venta.create({
        data: {
          id_venta: payload.id_venta,
          monto_total: new Decimal(payload.monto_total),
          metodo_pago: payload.metodo_pago,
          descripcion: payload.descripcion,
          estado: 'A',
          usuario_insercion: usuario
        }
      });

      // 3. Procesar Distribución
      for (const d of payload.distribucion) {
        if (d.tipo === 'CUOTA') {
          const cuota = await t.venta_cuota.findUnique({ where: { id: d.id_referencia } });
          if (!cuota) throw new AppError(`Cuota ${d.id_referencia} no encontrada.`, 404);

          const montoPagoCuota = new Decimal(d.monto);
          const montoMoraPagada = new Decimal(d.monto_mora || 0);
          
          // Actualizar Totales en Cuota
          const nuevoMontoPagado = new Decimal(cuota.monto_pagado).plus(montoPagoCuota);
          const nuevaMoraPagada = new Decimal(cuota.mora_pagada).plus(montoMoraPagada);
          
          // Lógica de Condonación: Si el pago cubre el resto del capital, 
          // la mora restante no pagada se marca como condonada.
          let nuevaMoraCondonada = new Decimal(cuota.mora_condonada);
          if (nuevoMontoPagado.gte(cuota.monto)) {
            const moraPendiente = new Decimal(cuota.mora_calculada).minus(nuevaMoraPagada);
            if (moraPendiente.gt(0)) {
               nuevaMoraCondonada = nuevaMoraCondonada.plus(moraPendiente);
            }
          }

          const estadoCuota = nuevoMontoPagado.gte(cuota.monto) ? 'PAGADA' : cuota.estado_cuota;

          await t.venta_cuota.update({
            where: { id: cuota.id },
            data: {
              monto_pagado: nuevoMontoPagado,
              mora_pagada: nuevaMoraPagada,
              mora_condonada: nuevaMoraCondonada,
              estado_cuota: estadoCuota as any
            }
          });

          await t.pago_cuota_aplicacion.create({
            data: {
              id_pago_venta: pago.id,
              id_venta_cuota: cuota.id,
              monto_aplicado: montoPagoCuota,
              monto_mora: montoMoraPagada,
              descripcion: d.descripcion
            }
          });

        } else if (d.tipo === 'CARGO') {
          const cargo = await t.venta_cargo.findUnique({ where: { id: d.id_referencia } });
          if (!cargo) throw new AppError(`Cargo ${d.id_referencia} no encontrado.`, 404);

          const montoAplicar = new Decimal(d.monto);
          const nuevoMontoPagado = new Decimal(cargo.monto_pagado).plus(montoAplicar);
          const nuevoSaldo = new Decimal(cargo.monto).minus(nuevoMontoPagado);
          const estadoCargo = nuevoSaldo.lte(0) ? 'PAGADO' : 'PARCIAL';

          await t.venta_cargo.update({
            where: { id: cargo.id },
            data: {
              monto_pagado: nuevoMontoPagado,
              saldo_pendiente: nuevoSaldo,
              estado_cargo: estadoCargo
            }
          });

          await t.pago_cargo_aplicacion.create({
            data: {
              id_pago_venta: pago.id,
              id_venta_cargo: cargo.id,
              monto_aplicado: montoAplicar,
              descripcion: d.descripcion
            }
          });
        }
      }

      // 4. Actualizar estado de la venta y saldo total
      await this.verificarYActualizarEstadoVenta(venta.id, t, usuario);

      return pago;
    };

    return tx ? execute(tx) : (await import('../../../config/prismaConnect.js')).default.$transaction(execute);
  }

  private async verificarYActualizarEstadoVenta(id_venta: number, t: any, usuario: string) {
    const venta = await t.venta.findUnique({
      where: { id: id_venta },
      include: { 
        cuotas: { where: { estado: 'A' } },
        cargos: { include: { cargo_tipo: true } }
      }
    });

    const totalCapital = venta.cuotas.reduce((sum: number, c: any) => sum + Number(c.monto), 0);
    const totalPagadoCapital = venta.cuotas.reduce((sum: number, c: any) => sum + Number(c.monto_pagado), 0);
    const saldoVenta = new Decimal(totalCapital).minus(new Decimal(totalPagadoCapital));

    // Una venta está pagada si:
    // 1. No debe capital en cuotas
    // 2. Todos los cargos VINCULANTES están pagados
    const cuotasPagadas = venta.cuotas.every((c: any) => c.estado_cuota === 'PAGADA');
    const cargosVinculantesPagados = venta.cargos
      .filter((c: any) => c.cargo_tipo.es_vinculante)
      .every((c: any) => c.estado_cargo === 'PAGADO');

    const nuevoEstado = (cuotasPagadas && cargosVinculantesPagados) ? 'PAGADA' : 'ACTIVA';

    await t.venta.update({
      where: { id: id_venta },
      data: {
        saldo_pendiente: saldoVenta,
        estado_venta: nuevoEstado,
        usuario_actualizacion: usuario
      }
    });
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

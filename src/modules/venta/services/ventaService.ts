import prisma from '../../../config/prismaConnect.js';
import { Decimal } from '@prisma/client/runtime/library';
import { AppError } from '../../../common/errors/AppError.js';
import { CreateVentaDto } from '../validator/schema.js';
import { CuotaService } from './cuotaService.js';
import { PagoService } from './pagoService.js';

export class VentaService {
  private cuotaService = new CuotaService();
  private pagoService = new PagoService();

  async crearVenta(payload: CreateVentaDto, usuario: string, tx?: any) {
    const execute = async (t: any) => {
      // 1. Validaciones de Inventario
      for (const detalle of payload.detalles) {
        const vehiculoIngreso = await t.vehiculo_ingreso.findUnique({
          where: { id: detalle.id_vehiculo_ingreso },
          include: { venta_detalle: true }
        });

        if (!vehiculoIngreso) {
          throw new AppError(`Vehículo con ID de ingreso ${detalle.id_vehiculo_ingreso} no encontrado en inventario.`, 404);
        }

        if (vehiculoIngreso.estado_ingreso !== 'EN_STOCK') {
          throw new AppError('El vehículo ya fue vendido y no está disponible.', 400);
        }

        const tieneVentaActiva = (vehiculoIngreso.venta_detalle as any[])?.some((vd: any) => vd.estado === 'A');
        if (tieneVentaActiva) {
          throw new AppError('Este vehículo ya está asociado a una venta activa.', 400);
        }
      }

      // 2. Calcular Montos e Interés
      const montoTotal = payload.detalles.reduce((sum, d) => sum + d.precio_venta, 0);
      let saldoPendiente = new Decimal(0);
      
      if (payload.tipo_pago === 'CREDITO') {
        const capital_financiar = new Decimal(montoTotal).minus(new Decimal(payload.inicial || 0));
        const tasa_decimal = new Decimal(payload.tasa_interes || 0).div(100);
        const interes_total = capital_financiar.mul(tasa_decimal).toDecimalPlaces(2);
        saldoPendiente = capital_financiar.plus(interes_total);
      }

      const estadoVenta = payload.tipo_pago === 'CONTADO' ? 'PAGADA' : 'ACTIVA';

      // 3. Crear Registro de Venta
      const venta = await t.venta.create({
        data: {
          id_cliente: payload.id_cliente,
          tipo_pago: (payload.tipo_pago as any),
          monto_total: new Decimal(montoTotal),
          inicial: new Decimal(payload.inicial || 0),
          saldo_pendiente: new Decimal(saldoPendiente),
          tasa_interes: new Decimal(payload.tasa_interes || 0),
          cantidad_cuotas: payload.cantidad_cuotas,
          estado_venta: estadoVenta,
          estado: 'A',
          usuario_insercion: usuario,
          detalles: {
            create: payload.detalles.map(d => ({
              id_vehiculo_ingreso: d.id_vehiculo_ingreso,
              precio_venta: new Decimal(d.precio_venta),
              estado: 'A',
              usuario_insercion: usuario
            }))
          },
          cargos: {
            create: (payload.cargos || []).map(c => ({
              id_cargo_tipo: c.id_cargo_tipo,
              monto: new Decimal(c.monto),
              monto_pagado: 0,
              saldo_pendiente: new Decimal(c.monto),
              estado_cargo: 'PENDIENTE',
              estado: 'A',
              usuario_insercion: usuario
            }))
          }
        },
        include: { detalles: true, cargos: true }
      });

      // 4. Actualizar Estado de Vehículos a VENDIDO
      for (const detalle of payload.detalles) {
        await t.vehiculo_ingreso.update({
          where: { id: detalle.id_vehiculo_ingreso },
          data: {
            estado_ingreso: 'VENDIDO',
            usuario_actualizacion: usuario
          }
        });
      }

      // 5. Lógica de Pago Inicial / Registro de Pagos
      const montoInicialDecimal = new Decimal(payload.inicial || 0);
      const notaPago = payload.comentario_pago || (payload.tipo_pago === 'CONTADO' ? 'Pago Total (Contado)' : 'Pago Inicial');

      if (payload.tipo_pago === 'CONTADO') {
        const montoPagoContado = montoInicialDecimal.gt(0) ? montoInicialDecimal : new Decimal(montoTotal);
        
        const pago = await t.pago_venta.create({
          data: {
            id_venta: venta.id,
            monto_total: montoPagoContado,
            metodo_pago: 'EFECTIVO',
            descripcion: notaPago,
            estado: 'A',
            usuario_insercion: usuario
          }
        });

        // Para ventas al contado, marcamos todos los cargos como PAGADOS
        for (const cargo of (venta.cargos || [])) {
            await t.venta_cargo.update({
                where: { id: cargo.id },
                data: {
                    monto_pagado: cargo.monto,
                    saldo_pendiente: 0,
                    estado_cargo: 'PAGADO',
                    usuario_actualizacion: usuario
                }
            });

            await t.pago_cargo_aplicacion.create({
                data: {
                    id_pago_venta: pago.id,
                    id_venta_cargo: cargo.id,
                    monto_aplicado: cargo.monto,
                    descripcion: 'Pago automático (Venta al Contado)'
                }
            });
        }
      } else {
        if (montoInicialDecimal.gt(0)) {
          await t.pago_venta.create({
            data: {
              id_venta: venta.id,
              monto_total: montoInicialDecimal,
              metodo_pago: 'EFECTIVO',
              descripcion: notaPago,
              estado: 'A',
              usuario_insercion: usuario
            }
          });
        }

        // Generar cuotas para el resto del monto con interés
        await this.cuotaService.generarCuotas(
          venta.id, 
          montoTotal, 
          payload.inicial || 0, 
          payload.cantidad_cuotas!,
          payload.tasa_interes || 0,
          usuario, 
          t
        );
      }

      return venta;
    };

    return tx ? execute(tx) : prisma.$transaction(execute);
  }

  async cancelarVenta(id: number, usuario: string, tx?: any) {
    const execute = async (t: any) => {
      const venta = await t.venta.findUnique({
        where: { id },
        include: { detalles: true }
      });

      if (!venta) throw new AppError('La venta no existe.', 404);
      if (venta.estado_venta === 'CANCELADA') throw new AppError('La venta ya está cancelada.', 400);

      // 1. Actualizar estado de la venta
      // 1. Actualizar estado de la venta y sus detalles
      await t.venta.update({
        where: { id },
        data: {
          estado_venta: 'CANCELADA',
          estado: 'I',
          usuario_actualizacion: usuario
        }
      });

      await t.venta_detalle.updateMany({
        where: { id_venta: id },
        data: { estado: 'I' }
      });

      // 2. Devolver vehículos al inventario (EN_STOCK)
      for (const detalle of venta.detalles) {
        await t.vehiculo_ingreso.update({
          where: { id: detalle.id_vehiculo_ingreso },
          data: {
            estado_ingreso: 'EN_STOCK',
            usuario_actualizacion: usuario
          }
        });
      }

      // 3. Anular cuotas
      await t.venta_cuota.updateMany({
        where: { id_venta: id },
        data: {
          estado_cuota: 'ANULADA',
          estado: 'I'
        }
      });

      // 4. Inactivar pagos
      await t.pago_venta.updateMany({
        where: { id_venta: id },
        data: { estado: 'I' }
      });

      // 5. Inactivar cargos
      await t.venta_cargo.updateMany({
        where: { id_venta: id },
        data: { estado: 'I' }
      });

      return { message: 'Venta cancelada exitosamente y vehículos devueltos al stock.' };
    };

    return tx ? execute(tx) : prisma.$transaction(execute);
  }

  async obtenerVenta(id: number) {
    return prisma.venta.findUnique({
      where: { id, estado: 'A' },
      include: {
        cliente: { include: { entidad: true } },
        detalles: { include: { vehiculo_ingreso: { include: { vehiculo: true } } } },
        cuotas: { where: { estado: 'A' }, orderBy: { numero_cuota: 'asc' } },
        cargos: { include: { cargo_tipo: true } },
        pagos: { 
          include: { 
            cuota_aplicaciones: { include: { venta_cuota: true } },
            cargo_aplicaciones: { include: { venta_cargo: { include: { cargo_tipo: true } } } }
          },
          orderBy: { fecha_pago: 'desc' }
        }
      }
    });
  }

  async listarVentas() {
    return prisma.venta.findMany({
      where: { estado: 'A' },
      include: {
        cliente: { include: { entidad: true } },
        cargos: { include: { cargo_tipo: true } }
      },
      orderBy: { fecha: 'desc' }
    });
  }
}

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

        if (vehiculoIngreso.venta_detalle) {
          throw new AppError('Este vehículo ya está asociado a una venta.', 400);
        }
      }

      // 2. Calcular Monto Total
      const montoTotal = payload.detalles.reduce((sum, d) => sum + d.precio_venta, 0);
      const saldoPendiente = payload.tipo_pago === 'CONTADO' ? 0 : montoTotal - (payload.inicial || 0);
      const estadoVenta = payload.tipo_pago === 'CONTADO' ? 'PAGADA' : 'ACTIVA';

      // 3. Crear Registro de Venta
      const venta = await t.venta.create({
        data: {
          id_cliente: payload.id_cliente,
          tipo_pago: (payload.tipo_pago as any),
          monto_total: new Decimal(montoTotal),
          inicial: new Decimal(payload.inicial || 0),
          saldo_pendiente: new Decimal(saldoPendiente),
          tasa_interes: payload.tasa_interes ? new Decimal(payload.tasa_interes) : null,
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
          }
        },
        include: { detalles: true }
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
      
      if (payload.tipo_pago === 'CONTADO') {
        // En venta al contado, el pago es por el total. 
        // Si el inicial viene vacío, usamos montoTotal. Si viene algo, usamos eso (debería ser el total).
        const montoPagoContado = montoInicialDecimal.gt(0) ? montoInicialDecimal : new Decimal(montoTotal);
        
        await t.pago_venta.create({
          data: {
            id_venta: venta.id,
            monto_total: montoPagoContado,
            metodo_pago: 'EFECTIVO',
            estado: 'A',
            usuario_insercion: usuario
          }
        });
      } else {
        // En venta a crédito, si hay un inicial, lo registramos como el primer pago.
        if (montoInicialDecimal.gt(0)) {
          await t.pago_venta.create({
            data: {
              id_venta: venta.id,
              monto_total: montoInicialDecimal,
              metodo_pago: 'EFECTIVO',
              estado: 'A',
              usuario_insercion: usuario
            }
          });
        }

        // Generar cuotas para el resto del monto
        await this.cuotaService.generarCuotas(
          venta.id, 
          montoTotal, 
          payload.inicial || 0, 
          payload.cantidad_cuotas!, 
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
      await t.venta.update({
        where: { id },
        data: {
          estado_venta: 'CANCELADA',
          usuario_actualizacion: usuario
        }
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

      await t.venta_cuota.updateMany({
        where: { id_venta: id, estado_cuota: 'PENDIENTE' },
        data: {
          estado_cuota: 'ANULADA'
        }
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
        pagos: { include: { aplicaciones: true } }
      }
    });
  }

  async listarVentas() {
    return prisma.venta.findMany({
      where: { estado: 'A' },
      include: {
        cliente: { include: { entidad: true } }
      },
      orderBy: { fecha: 'desc' }
    });
  }
}

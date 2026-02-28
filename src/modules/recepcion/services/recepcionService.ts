import prisma from '../../../config/prismaConnect.js';
import { CreateRecepcionDto } from '../validator/schema.js';
import { Decimal } from '@prisma/client/runtime/library';

export class RecepcionService {
  async create(payload: CreateRecepcionDto) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Manejo de Actualización de Estado (Especialmente ANULADA)
      if (payload.id && payload.estado_recepcion && !payload.detalles && !payload.id_proveedor) {
        const existe = await tx.recepcion.findUnique({ 
          where: { id: payload.id },
          include: { detalles: true }
        });
        if (!existe) throw new Error('La recepción no existe');

        if (payload.estado_recepcion === 'ANULADA') {
          for (const det of existe.detalles) {
            await tx.vehiculo_ingreso.update({
              where: { id: det.id_vehiculo_ingreso },
              data: { estado: 'I', usuario_actualizacion: payload.usuario_insercion }
            });
            await tx.recepcion_detalle.update({
              where: { id: det.id },
              data: { estado: 'I' }
            });
          }
        }

        return await tx.recepcion.update({
          where: { id: payload.id },
          data: { 
            estado_recepcion: payload.estado_recepcion,
            usuario_actualizacion: payload.usuario_insercion 
          }
        });
      }

      // 2. Si es una actualización de datos, limpiar detalles previos ANTES de validar stock
      if (payload.id && payload.detalles) {
        const existe = await tx.recepcion.findUnique({ where: { id: payload.id } });
        if (!existe) throw new Error('La recepción no existe');
        if (existe.estado_recepcion !== 'ABIERTA') throw new Error('Solo se pueden editar recepciones ABIERTAS');

        const detallesViejos = await tx.recepcion_detalle.findMany({ where: { id_recepcion: payload.id } });
        for (const dv of detallesViejos) {
            // Eliminamos el ingreso temporal para que no bloquee la validación de stock
            await tx.vehiculo_ingreso.delete({ where: { id: dv.id_vehiculo_ingreso } });
        }
        await tx.recepcion_detalle.deleteMany({ where: { id_recepcion: payload.id } });
      } else if (!payload.id && !payload.usuario_insercion) {
        throw new Error('El usuario (usuario_insercion) es obligatorio para crear una recepción.');
      }

      // 3. Procesar Detalles y Vehículos
      const detallesCreados = [];
      const montoTotal = payload.detalles?.reduce((sum, d) => sum + d.costo_unitario + (d.otros_costos || 0), 0) || 0;
      const saldoPendiente = payload.tipo_pago === 'CREDITO' ? montoTotal - (payload.inicial || 0) : 0;

      if (payload.detalles) {
        for (const d of payload.detalles) {
          // VALIDACIÓN: No permitir si ya está en STOCK o en OTRA recepción abierta
          const vehiculoExistente = await tx.vehiculo.findUnique({ 
            where: { chasis: d.chasis },
            include: { 
              ingresos: { 
                where: { 
                  estado_ingreso: { in: ['EN_STOCK', 'RECEPCION_ABIERTA'] }, 
                  estado: 'A' 
                } 
              } 
            }
          });

          if (vehiculoExistente && vehiculoExistente.ingresos.length > 0) {
            throw new Error(`El vehículo con chasis ${d.chasis} ya se encuentra reservado o en STOCK.`);
          }

          // A. Upsert del Vehículo
          const vehiculo = await tx.vehiculo.upsert({
            where: { chasis: d.chasis },
            update: {
              numero_maquina: d.numero_maquina,
              placa: d.placa,
              id_marca: d.id_marca,
              id_modelo: d.id_modelo,
              id_estilo: d.id_estilo,
              id_color: d.id_color,
              anio: d.anio,
              cilindraje: d.cilindraje,
              usuario_actualizacion: payload.usuario_insercion
            },
            create: {
              chasis: d.chasis,
              numero_maquina: d.numero_maquina,
              placa: d.placa,
              id_marca: d.id_marca,
              id_modelo: d.id_modelo,
              id_estilo: d.id_estilo,
              id_color: d.id_color,
              anio: d.anio,
              cilindraje: d.cilindraje,
              estado: 'A',
              usuario_insercion: payload.usuario_insercion
            }
          });

          // B. Crear el Ingreso (RECEPCION_ABIERTA)
          const ingreso = await tx.vehiculo_ingreso.create({
            data: {
              id_vehiculo: vehiculo.id,
              condicion: d.condicion,
              costo_compra: d.costo_unitario,
              precio_venta_estimado: d.precio_venta_estimado,
              estado_ingreso: 'RECEPCION_ABIERTA',
              estado: 'A',
              usuario_insercion: payload.usuario_insercion
            }
          });

          detallesCreados.push({
            id_vehiculo_ingreso: ingreso.id,
            costo_unitario: d.costo_unitario,
            otros_costos: d.otros_costos,
            costo_total: d.costo_unitario + (d.otros_costos || 0),
            estado: 'A',
            usuario_insercion: payload.usuario_insercion,
          });
        }
      }

      // 4. Guardar Recepción
      const commonData = {
        id_proveedor: payload.id_proveedor!,
        tipo_pago: (payload.tipo_pago as any),
        monto_total: montoTotal,
        inicial: payload.inicial || 0,
        saldo_pendiente: saldoPendiente,
      };

      if (payload.id) {
        return await tx.recepcion.update({
          where: { id: payload.id },
          data: {
            ...commonData,
            usuario_actualizacion: payload.usuario_insercion,
            detalles: { create: detallesCreados }
          },
          include: { detalles: true }
        });
      } else {
        return await tx.recepcion.create({
          data: {
            ...commonData,
            estado: 'A',
            usuario_insercion: payload.usuario_insercion,
            detalles: { create: detallesCreados }
          },
          include: { detalles: true }
        });
      }
    });
  }

  async cerrar(id: number, usuario: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Buscar la recepción con sus detalles
      const recepcion = await tx.recepcion.findUnique({
        where: { id },
        include: { detalles: true }
      });

      if (!recepcion) throw new Error('Recepción no encontrada');
      if (recepcion.estado_recepcion !== 'ABIERTA') throw new Error('La recepción ya no está abierta');
      if (recepcion.detalles.length === 0) throw new Error('No se puede cerrar una recepción sin detalles');

      // 2. Actualizar estado de la recepción
      await tx.recepcion.update({
        where: { id },
        data: {
          estado_recepcion: 'CERRADA',
          usuario_actualizacion: usuario
        }
      });

      // 3. Actualizar vehículos a EN_STOCK
      for (const detalle of recepcion.detalles) {
        await tx.vehiculo_ingreso.update({
          where: { id: detalle.id_vehiculo_ingreso },
          data: {
            estado_ingreso: 'EN_STOCK',
            usuario_actualizacion: usuario
          }
        });
      }

      // 4. Si es CREDITO, crear Cuenta por Pagar (CXP)
      if (recepcion.tipo_pago === 'CREDITO') {
        const saldoPendiente = recepcion.saldo_pendiente || new Decimal(0);
        
        await tx.cuenta_por_pagar.create({
          data: {
            id_proveedor: recepcion.id_proveedor,
            id_recepcion: recepcion.id,
            monto_original: recepcion.monto_total,
            saldo_pendiente: saldoPendiente,
            estado_cxp: 'PENDIENTE',
            estado: 'A',
            usuario_insercion: usuario,
          }
        });
      }

      return { message: 'Recepción cerrada correctamente' };
    });
  }

  async findById(id: number) {
    return prisma.recepcion.findUnique({
      where: { id, estado: 'A' },
      include: {
        proveedor: true,
        detalles: {
          include: {
            vehiculo_ingreso: {
              include: {
                vehiculo: true
              }
            }
          }
        },
        cuenta_por_pagar: true
      }
    });
  }

  async list() {
    return prisma.recepcion.findMany({
      where: { estado: 'A' },
      include: {
        proveedor: {
            include: {
                entidad: true
            }
        },
        detalles: true
      },
      orderBy: { fecha: 'desc' }
    });
  }
}

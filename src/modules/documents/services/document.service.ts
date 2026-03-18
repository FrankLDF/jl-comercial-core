import prisma from '../../../config/prismaConnect.js';
import { AppError } from '../../../common/errors/AppError.js';
import { TemplateRenderer } from '../engine/template.renderer.js';
import { PDFGenerator } from '../engine/pdf.generator.js';
import { companyInfo } from '../../../common/utils/constant.js';

export class DocumentService {
  async getPaymentReceipt(paymentId: number) {
    const payment = await prisma.pago_venta.findUnique({
      where: { id: paymentId },
      include: { 
        venta: { 
          include: { 
            cliente: { 
              include: { 
                entidad: { 
                  include: { tipo_documento: true } 
                } 
              } 
            } 
          } 
        } 
      }
    });

    if (!payment) throw new AppError('Pago no encontrado', 404);

    const html = await TemplateRenderer.render('payment-receipt', {
      payment,
      venta: payment.venta,
      cliente: payment.venta.cliente.entidad,
      companyInfo
    });

    return PDFGenerator.generatePDF(html);
  }

  async getInstallmentReceipt(installmentId: number) {
    const cuota = await prisma.venta_cuota.findUnique({
      where: { id: installmentId },
      include: { 
        venta: { 
          include: { 
            cliente: { 
              include: { 
                entidad: { 
                  include: { tipo_documento: true } 
                } 
              } 
            } 
          } 
        } 
      }
    });

    if (!cuota) throw new AppError('Cuota no encontrada', 404);

    const totalCuotas = await prisma.venta_cuota.count({
      where: { id_venta: cuota.id_venta }
    });

    const html = await TemplateRenderer.render('installment-receipt', {
      cuota,
      totalCuotas,
      cliente: cuota.venta.cliente.entidad,
      companyInfo
    });

    return PDFGenerator.generatePDF(html);
  }

  async getVehicleDocument(vehicleIngresoId: number, type: 'route-letter' | 'sale-act' | 'balance-letter' | 'financing-contract') {
    const vehicle = await prisma.vehiculo_ingreso.findUnique({
      where: { id: vehicleIngresoId },
      include: { 
        vehiculo: true,
        venta_detalle: { 
            include: { 
                venta: { 
                    include: { 
                        cliente: { include: { entidad: true } } 
                    } 
                } 
            } 
        } 
      }
    });

    if (!vehicle || !vehicle.venta_detalle) {
      throw new AppError('Vehículo o venta asociada no encontrada', 404);
    }

    const html = await TemplateRenderer.render(type, {
      vehiculo: vehicle.vehiculo,
      venta: vehicle.venta_detalle.venta,
      cliente: vehicle.venta_detalle.venta.cliente.entidad
    });

    return PDFGenerator.generatePDF(html);
  }
}

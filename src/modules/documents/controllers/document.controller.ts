import { NextFunction, Request, Response } from 'express';
import { DocumentService } from '../services/document.service.js';

const documentService = new DocumentService();

export class DocumentController {
  async getPaymentReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const pdfBuffer = await documentService.getPaymentReceipt(Number(paymentId));
      this.streamPDF(res, pdfBuffer, `pago-${paymentId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  async getInstallmentReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { installmentId } = req.params;
      const pdfBuffer = await documentService.getInstallmentReceipt(Number(installmentId));
      this.streamPDF(res, pdfBuffer, `cuota-${installmentId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  async getRouteLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleIngresoId } = req.params;
      const pdfBuffer = await documentService.getVehicleDocument(Number(vehicleIngresoId), 'route-letter');
      this.streamPDF(res, pdfBuffer, `carta-ruta-${vehicleIngresoId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  async getSaleAct(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleIngresoId } = req.params;
      const pdfBuffer = await documentService.getVehicleDocument(Number(vehicleIngresoId), 'sale-act');
      this.streamPDF(res, pdfBuffer, `acta-venta-${vehicleIngresoId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  async getBalanceLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleIngresoId } = req.params;
      const pdfBuffer = await documentService.getVehicleDocument(Number(vehicleIngresoId), 'balance-letter');
      this.streamPDF(res, pdfBuffer, `carta-saldo-${vehicleIngresoId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  async getFinancingContract(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleIngresoId } = req.params;
      const pdfBuffer = await documentService.getVehicleDocument(Number(vehicleIngresoId), 'financing-contract');
      this.streamPDF(res, pdfBuffer, `contrato-finan-${vehicleIngresoId}.pdf`);
    } catch (error) {
      next(error);
    }
  }

  private streamPDF(res: Response, pdfBuffer: Buffer, filename: string) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': pdfBuffer.length
    });
    res.end(pdfBuffer);
  }
}

import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller.js';

const router = Router();
const controller = new DocumentController();

// Recibos
router.get('/payments/:paymentId/receipt', controller.getPaymentReceipt.bind(controller));
router.get('/installments/:installmentId/receipt', controller.getInstallmentReceipt.bind(controller));

// Documentos por Vehículo
router.get('/vehicles/:vehicleIngresoId/route-letter', controller.getRouteLetter.bind(controller));
router.get('/vehicles/:vehicleIngresoId/sale-act', controller.getSaleAct.bind(controller));
router.get('/vehicles/:vehicleIngresoId/balance-letter', controller.getBalanceLetter.bind(controller));
router.get('/vehicles/:vehicleIngresoId/financing-contract', controller.getFinancingContract.bind(controller));

export default router;

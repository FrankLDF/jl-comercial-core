import { Router } from 'express';
import { VentaController } from '../controllers/ventaController.js';

const router = Router();
const controller = new VentaController();

// Ventas
router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.patch('/:id/cancelar', controller.cancelar.bind(controller));

// Pagos y Cuotas
router.post('/pagos', controller.registrarPago.bind(controller));
router.get('/:id/cuotas', controller.getCuotas.bind(controller));
router.get('/:id/pagos', controller.getPagos.bind(controller));

export default router;

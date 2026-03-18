import { Router } from 'express';
import { VentaController } from '../controllers/ventaController.js';
import { PagoController } from '../controllers/pagoController.js';
import { CargoController } from '../controllers/cargoController.js';

const router = Router();
const ventaController = new VentaController();
const pagoController = new PagoController();
const cargoController = new CargoController();

router.post('/', (req, res, next) => ventaController.crearVenta(req, res, next));
router.get('/', (req, res, next) => ventaController.listarVentas(req, res, next));
router.get('/:id', (req, res, next) => ventaController.obtenerVenta(req, res, next));
router.post('/:id/cancelar', (req, res, next) => ventaController.cancelarVenta(req, res, next));

// Pagos
router.post('/pagos', (req, res, next) => pagoController.registrarPago(req, res, next));

// Catálogo de Cargos
router.get('/config/tipos-cargos', (req, res, next) => cargoController.listarTiposCargos(req, res, next));
router.post('/config/tipos-cargos', (req, res, next) => cargoController.crearTipoCargo(req, res, next));
router.get('/:id/cuotas', (req, res, next) => ventaController.getCuotas(req, res, next));
router.get('/:id/pagos', (req, res, next) => pagoController.obtenerPagosVenta(req, res, next));

export default router;

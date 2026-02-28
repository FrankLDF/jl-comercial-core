import { Router } from 'express';
import { InventarioController } from '../controllers/inventarioController.js';

const router = Router();
const controller = new InventarioController();

router.get('/', controller.list);

export const inventarioRoute = router;

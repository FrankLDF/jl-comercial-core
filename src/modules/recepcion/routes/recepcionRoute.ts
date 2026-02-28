import { Router } from 'express';
import { RecepcionController } from '../controllers/recepcionController.js';

const router = Router();
const controller = new RecepcionController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.post('/:id/cerrar', controller.cerrar.bind(controller));

export { router as recepcionRoute };

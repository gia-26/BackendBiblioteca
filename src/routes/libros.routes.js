import { Router } from 'express';
import * as ctrl from '../controllers/libros.controllers.js';

const router = Router();

router.get('/:id', ctrl.getLibrosById);
router.get('/:id/subgeneros', ctrl.getSubgenerosByLibroId);

router.post('/agregar', ctrl.agregarLibro)

export default router;
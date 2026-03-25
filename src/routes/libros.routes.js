import { Router } from 'express';
import * as ctrl from '../controllers/libros.controllers.js';

const router = Router();

router.get('/', ctrl.getAllLibros);

router.get('/:id', ctrl.getLibrosById);

router.post('/agregar', ctrl.agregarLibro)

router.put('/editar', ctrl.editarLibro)

router.delete('/eliminar/imagen', ctrl.eliminarImagenAnterior)

export default router;
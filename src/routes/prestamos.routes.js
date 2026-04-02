import {Router} from 'express';
import * as ctrl from '../controllers/prestamos.controllers.js';

const router = Router();

router.get('/ejemplares', ctrl.getAllEjemplares);
router.get('/tipos', ctrl.getAllTiposPrestamos);
router.get('/', ctrl.getAllPrestamos);
router.get('/ejemplares/buscar', ctrl.getAllEjemplaresByTitulo);
router.get('/buscar', ctrl.buscarPrestamos);

router.post('/registrar', ctrl.registrarPrestamo);
router.put('/devolver', ctrl.devolverPrestamo);
router.post('/renovar', ctrl.renovarPrestamo);

export default router;

import {Router} from 'express';
import * as ctrl from '../controllers/multas.controllers.js';

const router = Router();

router.get('/', ctrl.getAllMultas);
router.get('/generar', ctrl.generarMultas);

export default router;
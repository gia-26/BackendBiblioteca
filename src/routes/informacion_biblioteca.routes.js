import {Router} from 'express';
import * as ctrl from '../controllers/informacion_biblioteca.controllers.js';

const router = Router();

router.get("/informacion", getInformacion);
router.put('/informacion', ctrl.updateInformacion);

router.get('/mvo', ctrl.getMVO);

router.put('/mision', ctrl.updateMision);
router.put('/vision', ctrl.updateVision);
router.put('/objetivo', ctrl.updateObjetivo);

export default router;
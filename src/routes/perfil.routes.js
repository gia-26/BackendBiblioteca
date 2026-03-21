import { Router } from 'express';
import * as ctrl from '../controllers/perfil.controllers.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:idUsuario', verificarToken, ctrl.getPerfil);
router.put('/telefono', verificarToken, ctrl.updateTelefono);
router.put('/password', verificarToken, ctrl.updatePassword);

export default router;
import { Router } from "express";
import * as ctrl from "../controllers/usuarios.controllers.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/buscar", ctrl.getUsuariosById);
router.get('/tipos', ctrl.getAllTiposUsuario);
router.get('/todos', ctrl.getAllUsuarios);
router.put('/editar/password', ctrl.editPasswordUsuario);

// Obtener todas las multas del usuario logueado
router.get('/', verificarToken, ctrl.getMultasByUsuario);

// Obtener resumen (monto total)
router.get('/resumen', verificarToken,ctrl.getResumenMultas);

// historial de prestamos
router.get('/usuario/estadisticas/:id',ctrl.getEstadisticasUsuario);
router.get('/usuario/mis-prestamos/:id',ctrl.getPrestamosUsuario);


export default router;
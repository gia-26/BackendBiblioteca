import { Router } from "express";
import * as ctrl from "../controllers/usuarios.controllers.js";

const router = Router();

router.get("/buscar", ctrl.getUsuariosById);
router.get('/tipos', ctrl.getAllTiposUsuario);
router.get('/todos', ctrl.getAllUsuarios);

// Editar contraseña
router.put('/editar-password', ctrl.editPasswordUsuario);

// Obtener todas las multas del usuario logueado
router.get('/', ctrl.getMultasByUsuario);

// Obtener resumen (monto total)
router.get('/resumen', ctrl.getResumenMultas);

// historial de prestamos
router.get('/usuario/estadisticas', ctrl.getEstadisticasUsuario);
router.get('/usuario/mis-prestamos', ctrl.getPrestamosUsuario);


export default router;
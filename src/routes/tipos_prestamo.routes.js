import { Router } from "express";
import * as ctrl from "../controllers/tipos_prestamo.controllers.js";

const router = Router();

router.get("/", ctrl.getTiposPrestamo);
router.post("/agregar", ctrl.agregarTipoPrestamo);
router.post("/editar", ctrl.editarTipoPrestamo);
router.post("/eliminar", ctrl.eliminarTipoPrestamo);

export default router;
import { Router } from "express";
import * as ctrl from "../controllers/anio_edicion.controllers.js";

const router = Router();

router.get("/", ctrl.getAnios);
router.post("/agregar", ctrl.agregarAnio);
router.post("/editar", ctrl.editarAnio);
router.post("/eliminar", ctrl.eliminarAnio);

export default router;
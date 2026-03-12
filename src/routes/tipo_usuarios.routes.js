import { Router } from "express";
import * as ctrl from "../controllers/tipo_usuarios.controllers.js";

const router = Router();

router.get("/", ctrl.getTipos);
router.post("/agregar", ctrl.agregarTipo);
router.post("/editar", ctrl.editarTipo);
router.post("/eliminar", ctrl.eliminarTipo);

export default router;
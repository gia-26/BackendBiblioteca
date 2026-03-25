import * as ctrl from "../controllers/generos.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/", ctrl.getAllGeneros);
router.post("/agregar", ctrl.agregarGenero);
router.post("/editar", ctrl.editarGenero);
router.post("/eliminar", ctrl.eliminarGenero);

export default router;
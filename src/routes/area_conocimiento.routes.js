import { Router } from "express";
import * as ctrl from "../controllers/area_conocimiento.controllers.js";

const router = Router();

router.get("/", ctrl.getAreas);
router.post("/agregar", ctrl.agregarArea);
router.post("/editar", ctrl.editarArea);
router.post("/eliminar", ctrl.eliminarArea);

export default router;
import { Router } from "express";
import * as ctrl from "../controllers/editoriales.controllers.js";

const router = Router();

router.get("/", ctrl.getEditoriales);
router.post("/agregar", ctrl.agregarEditorial);
router.post("/editar", ctrl.editarEditorial);
router.post("/eliminar", ctrl.eliminarEditorial);

export default router;
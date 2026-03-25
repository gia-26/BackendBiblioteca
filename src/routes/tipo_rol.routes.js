import * as ctrl from "../controllers/tipo_rol.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/", ctrl.getAllRoles);
router.post("/agregar", ctrl.agregarRol);
router.post("/editar", ctrl.editarRol);
router.post("/eliminar", ctrl.eliminarRol);

export default router;
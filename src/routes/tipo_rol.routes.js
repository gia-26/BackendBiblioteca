import * as ctrl from "../controllers/roles.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/", ctrl.getAllRoles);
router.post("/agregar", ctrl.agregarRol);
router.post("/editar", ctrl.editarRol);
router.post("/eliminar", ctrl.eliminarRol);

export default router;
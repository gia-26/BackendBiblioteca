import * as ctrl from "../controllers/autores.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/", ctrl.getAllAutores);
router.post("/agregar", ctrl.agregarAutor);
router.post("/editar", ctrl.editarAutor);
router.post("/eliminar", ctrl.eliminarAutor);

export default router;
import { Router } from "express";
import * as ctrl from "../controllers/generos.controllers.js";

const router = Router();

// OBTENER TODOS LOS GENEROS
router.get("/", ctrl.getAllGeneros);

// AGREGAR GENERO
router.post("/agregar", ctrl.agregarGenero);

// EDITAR GENERO
router.post("/editar", ctrl.editarGenero);

// ELIMINAR GENERO
router.post("/eliminar", ctrl.eliminarGenero);

export default router;
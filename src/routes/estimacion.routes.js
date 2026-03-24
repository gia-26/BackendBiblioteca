import { Router } from "express";
import * as ctrl from "../controllers/estimacion.controllers.js";

const router = Router();

router.get('/', ctrl.getAllLibrosEstimaciones);

router.get('/libro/datos', ctrl.getDatosLibro);

export default router;
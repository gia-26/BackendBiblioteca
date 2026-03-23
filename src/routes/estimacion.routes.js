import { Router } from "express";
import * as ctrl from "../controllers/estimacion.controllers.js";

const router = Router();

router.get('/', ctrl.getAllLibrosEstimaciones);

export default router;
import * as ctrl from "../controllers/autores.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/", ctrl.getAllAutores);

export default router;
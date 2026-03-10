import { Router } from "express";
import * as ctrl from "../controllers/personal.controllers.js";

const router = Router();

router.get('/', ctrl.getAllPersonal);

export default router;
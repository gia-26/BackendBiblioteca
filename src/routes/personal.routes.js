import { Router } from "express";
import * as ctrl from "../controllers/personal.controllers.js";

const router = Router();

router.get('/', ctrl.getAllPersonal);
router.get('/tipos-roles', ctrl.getAllTiposRoles);

export default router;
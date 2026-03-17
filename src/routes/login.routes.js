import { Router } from "express";
import * as ctrl from '../controllers/login.controllers.js';

const router = Router();

router.post('/', ctrl.login);

export default router;
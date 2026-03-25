import { Router } from "express";
import * as ctrl from "../controllers/personal.controllers.js";

const router = Router();

//Públicas
router.get('/', ctrl.getAllPersonal);
router.get('/tipos-roles', ctrl.getAllTiposRoles);
router.get('/:id', ctrl.getPersonalById);

//Privadas
router.put('/editar/password', ctrl.editPasswordUsuario);

export default router;
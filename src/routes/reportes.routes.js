import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controllers.js';

const router = Router();

router.get('/dashboard', ctrl.getDashboardStats);
router.get('/', ctrl.getReporte);
router.get('/pdf', ctrl.generarPDF);

export default router;
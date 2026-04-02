import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { Role } from '../generated/prisma';

const router = Router()

router.use(authenticate)

router.get('/summary', authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), dashboardController.getSummary)
router.get('/trends', authorize(Role.ADMIN, Role.ANALYST), dashboardController.getMonthlyTrend)

export default router
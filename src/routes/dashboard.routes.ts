import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { Role } from '../generated/prisma';

const router = Router()

router.use(authenticate)

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns summary
 */
router.get('/summary', authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), dashboardController.getSummary)
/**
 * @openapi
 * /api/dashboard/trends:
 *   get:
 *     summary: Get dashboard trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns trends
 */
router.get('/trends', authorize(Role.ADMIN, Role.ANALYST), dashboardController.getMonthlyTrend)

export default router
import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authorize } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { Role } from "../generated/prisma";
import { updateUserSchema } from "../validators/user.validator";

const router = Router()

router.use(authenticate)

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/', authorize(Role.ADMIN), userController.getAllUser)
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns user
 */
router.get('/:id', authorize(Role.ADMIN), userController.getUserById);
/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch('/:id', authorize(Role.ADMIN), validate(updateUserSchema), userController.updateUser);
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', authorize(Role.ADMIN), userController.deleteUser);

export default router;
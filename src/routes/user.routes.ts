import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authorize } from "../middleware/rbac.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { Role } from "../generated/prisma";
import { updateUserSchema } from "../validators/user.validator";

const router = Router()

router.use(authenticate)

router.get('/', authorize(Role.ADMIN), userController.getAllUser)
router.get('/:id', authorize(Role.ADMIN), userController.getUserById);
router.patch('/:id', authorize(Role.ADMIN), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize(Role.ADMIN), userController.deleteUser);

export default router;
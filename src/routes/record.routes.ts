import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { recordController } from "../controllers/record.controller";
import { createRecordSchema, updateRecordSchema, filterRecordSchema } from "../validators/record.validator";
import { Role } from "../generated/prisma";
import { validate } from "../middleware/validate.middleware";

const router = Router()

router.use(authenticate)

router.post('/', authorize(Role.ADMIN, Role.ANALYST), validate(createRecordSchema), recordController.createRecord)
router.get('/', authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), validate(filterRecordSchema), recordController.getAllRecord)
router.get('/:id', authorize(Role.ADMIN, Role.ANALYST, Role.VIEWER), recordController.getRecordById)
router.patch('/:id', authorize(Role.ADMIN, Role.ANALYST), validate(updateRecordSchema), recordController.updateRecord)
router.delete('/:id', authorize(Role.ADMIN), recordController.deleteRecord)

export default router
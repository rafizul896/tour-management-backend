import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../utils/validateRequest";
import {
  createDivisionValidationSchema,
  updateDivisionValidationSchema,
} from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionValidationSchema),
  DivisionControllers.createDivision,
);
router.get("/", DivisionControllers.getAllDivision);
router.get("/:id", DivisionControllers.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionValidationSchema),
  DivisionControllers.updateDivision,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.deleteDivision,
);

export const DivisionRoutes = router;

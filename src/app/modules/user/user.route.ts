import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { updateUserSchema, userSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);

router.get("/", checkAuth(...Object.values(Role)), UserControllers.getAllUsers);

router.patch(
  "/:id",
  validateRequest(updateUserSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

export const UserRoutes = router;

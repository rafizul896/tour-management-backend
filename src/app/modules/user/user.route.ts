import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { userSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);
router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;

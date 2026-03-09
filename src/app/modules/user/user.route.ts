import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { userSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
const router = Router();

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);
router.get("/", checkAuth("USER"), UserControllers.getAllUsers);

export const UserRoutes = router;

import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { userSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);
router.get("/", checkAuth(Role.USER), UserControllers.getAllUsers);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

export const UserRoutes = router;

import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { updateUserSchema, userSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";
const router = Router();

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);

router.get(
  "/all-users",
  checkAuth(...Object.values(Role)),
  UserControllers.getAllUsers,
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(updateUserSchema),
  UserControllers.updateUser,
);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser,
);

export const UserRoutes = router;

import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { GuideControllers } from "./guide.controller";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../utils/validateRequest";
import { guideValidationSchema } from "./guide.validation";

const router = Router();

router.post(
  "/apply",
  checkAuth(Role.USER),
  multerUpload.single("file"),
  validateRequest(guideValidationSchema),
  GuideControllers.applyForGuide,
);

router.patch(
  "/approve/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  GuideControllers.updateApplicationStatus,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.getAllGuideApplications,
);

router.get(
  "/my-application",
  checkAuth(Role.USER, Role.GUIDE),
  GuideControllers.getMyGuideApplication,
);

router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  GuideControllers.softDeleteGuide,
);

export const guideRoutes = router;

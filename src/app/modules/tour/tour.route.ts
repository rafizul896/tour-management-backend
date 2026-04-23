import { Router } from "express";
import { TourController } from "./tour.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// Tour Type Routes
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createTourType,
);

router.get("/tour-type", TourController.getAllTourTypes);

router.patch(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.updateTourType,
);

router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType,
);

// Tour
router.get("/", TourController.getAllTours);

export const TourRoutes = router;

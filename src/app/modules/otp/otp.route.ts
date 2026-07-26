import { Router } from "express";
import { OTPControllers } from "./otp.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/send", checkAuth(...Object.values(Role)), OTPControllers.sendOTP);
router.post("/verify", OTPControllers.verifyOTP);

export const OTPRoutes = router;

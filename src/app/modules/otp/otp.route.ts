import { Router } from "express";
import { OTPControllers } from "./otp.controller";

const router = Router();

router.post("/send", OTPControllers.sendOTP);
router.post("/verify", OTPControllers.verifyOTP);

export const OTPRoutes = router;

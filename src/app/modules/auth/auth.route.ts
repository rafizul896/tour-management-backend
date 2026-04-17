import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.patch(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword,
);
router.get(
  "/google",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
  },
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallback,
);

export const AuthRouter = router;

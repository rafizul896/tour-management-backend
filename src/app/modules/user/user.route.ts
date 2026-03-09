import { Router } from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { userSchema } from "./user.validation";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const router = Router();

const checkAuth =
  (...authRoles: string[]) =>
  async (req, res, next) => {
    console.log(authRoles);
    const accessToken = req.headers.authorization;
    const verifiedToken = verifyToken(
      accessToken as string,
      envVars.JWT_ACCESS_SECRET,
    );

    if (!verifiedToken) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
    }

    if ((verifiedToken as JwtPayload).role !== Role.USER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are Not permitted for access this route!",
      );
    }

    next();
  };

router.post(
  "/register",
  validateRequest(userSchema),
  UserControllers.createUser,
);
router.get("/", checkAuth("USER","HELLO"), UserControllers.getAllUsers);

export const UserRoutes = router;

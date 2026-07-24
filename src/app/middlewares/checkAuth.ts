import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization;

    const verifiedToken = verifyToken(
      accessToken as string,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    if (!verifiedToken) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
    }

    const isUserExist = await User.findOne({
      email: verifiedToken.email,
    });

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    if (
      isUserExist.isActive === IsActive.BLOCKED ||
      isUserExist.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        `User is ${isUserExist.isActive}`,
      );
    }

    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }

    if (!isUserExist.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
    }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are Not permitted for access this route!",
      );
    }

    req.user = verifiedToken;

    next();
  };

export default checkAuth;

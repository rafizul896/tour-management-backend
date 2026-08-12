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
    try {
      let accessToken: string | undefined;

      if (req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
      } else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          accessToken = authHeader.split(" ")[1];
        } else {
          accessToken = authHeader;
        }
      }

      if (!accessToken) {
        return next(new AppError(httpStatus.UNAUTHORIZED, "Token missing"));
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      if (!verifiedToken) {
        return next(new AppError(httpStatus.FORBIDDEN, "Invalid token"));
      }

      const isUserExist = await User.findOne({ email: verifiedToken.email });
      if (!isUserExist) {
        return next(new AppError(httpStatus.NOT_FOUND, "User doesn't exist"));
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        return next(
          new AppError(httpStatus.FORBIDDEN, `User is ${isUserExist.isActive}`),
        );
      }

      if (isUserExist.isDeleted) {
        return next(new AppError(httpStatus.BAD_REQUEST, "User is deleted"));
      }

      if (!isUserExist.isVerified) {
        return next(
          new AppError(httpStatus.BAD_REQUEST, "User is not verified"),
        );
      }

      if (!authRoles.includes(verifiedToken.role)) {
        return next(
          new AppError(
            httpStatus.FORBIDDEN,
            "You are not permitted to access this route!",
          ),
        );
      }

      req.user = verifiedToken;
      return next();
    } catch (error) {
      return next(error);
    }
  };

export default checkAuth;

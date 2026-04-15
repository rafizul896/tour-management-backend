import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    const verifiedToken = verifyToken(
      accessToken as string,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    if (!verifiedToken) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
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

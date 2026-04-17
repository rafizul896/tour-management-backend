/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { generateToken } from "../../utils/jwt";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { IUser } from "../user/user.interface";

const credentialsLogin = catchAsync(async (req, res, next) => {
  const logInfo = await AuthServices.credentialsLogin(req.body);

  res.cookie("accessToken", logInfo.accessToken, {
    httpOnly: true,
    secure: false,
  });

  res.cookie("refreshToken", logInfo.refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Logged in successfully",
    data: logInfo,
  });
});

const getNewAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  res.cookie("accessToken", tokenInfo.accessToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New access token retrived successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successfully",
    data: null,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const decodedToken = req.user as JwtPayload;
  const data = req.body;
  const change = await AuthServices.changePassword(decodedToken, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: change,
  });
});

const googleCallback = catchAsync(async (req, res, next) => {
  const user = req.user;
  const callBack = await AuthServices.googleCallback(user, res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged with google successfully",
    data: callBack,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleCallback,
};

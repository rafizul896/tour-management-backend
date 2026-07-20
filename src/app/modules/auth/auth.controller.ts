/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req, res, next) => {
  const logInfo = await AuthServices.credentialsLogin(req.body);

  res.cookie("accessToken", logInfo.accessToken, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.cookie("refreshToken", logInfo.refreshToken, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30,
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
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
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
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
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

const setPassword = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const decodedToken = req.user as JwtPayload;

  const change = await AuthServices.setPassword(decodedToken.userId, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: change,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email
 await AuthServices.forgotPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email sent successfully",
    data: null,
  });
});


const resetPassword = catchAsync(async (req, res, next) => {
  const decodedToken = req.user as JwtPayload;
  const payload = req.body;
  const change = await AuthServices.resetPassword(decodedToken.userId,payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: change,
  });
});

const googleCallback = catchAsync(async (req, res, next) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }

  const user = req.user;

  await AuthServices.googleCallback(user, res);
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  resetPassword,
  setPassword,
  forgotPassword,
  googleCallback,
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status-codes";

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

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Token got successfully",
    data: tokenInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
};

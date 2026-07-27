/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OTPService } from "./otp.service";
import httpStatus from "http-status-codes";

const sendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.user as JwtPayload;
  await OTPService.sendOTP(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP is sent successfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req, res, next) => {
  await OTPService.verifyOTP(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "OTP is verified successfully",
    data: null,
  });
});

export const OTPControllers = {
  sendOTP,
  verifyOTP,
};

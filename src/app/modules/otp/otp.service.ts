import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60; // 2 minutes

const genarateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sendOTP = async (payload: { name: string; email: string }) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(401, "User not Found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const otp = genarateOTP();
  const redisKey = `otp:${payload.email}`;

  await redisClient.set(redisKey, otp, {
    expiration: { type: "EX", value: OTP_EXPIRATION },
  });

  await sendEmail({
    to: payload.email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: payload.name,
      otp,
    },
  });
};

const verifyOTP = async (payload: { email: string; otp: string }) => {
  const redisKey = `otp:${payload.email}`;

  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
    throw new AppError(401, "Invalid OTP");
  }

  if (savedOTP !== payload.otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    User.findOneAndUpdate(
      { email: payload.email },
      { isVerified: true },
      { runValidators: true },
    ),

    redisClient.del(redisKey),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};

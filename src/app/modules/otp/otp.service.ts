import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const OTP_EXPIRATION = 2 * 60; // 2 minutes

const genarateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sendOTP = async (payload: { name: string; email: string }) => {
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
      otp
    },
  });
};

const verifyOTP = async () => {
  //
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};

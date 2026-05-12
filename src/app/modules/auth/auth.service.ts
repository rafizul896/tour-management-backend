/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  const isPasswordMatch = bcrypt.compareSync(
    payload.password as string,
    isUserExist.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = { userId: isUserExist._id, email, role: isUserExist.role };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return { accessToken, refreshToken };
};

const getNewAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Refresh token is not found from cookies",
    );
  }

  const verifiedRefeshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefeshToken.email });

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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return { accessToken };
};

const changePassword = async (
  decodedToken: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ email: decodedToken.email });

  const isPasswordMatch = bcrypt.compareSync(
    payload.oldPassword,
    user?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect old Password");
  }

  user!.password = bcrypt.hashSync(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  user?.save();

  return true;
};

const googleCallback = async (
  user: Partial<IUser | undefined>,
  res: Response,
) => {
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  return;
};

const resetPassword = async () => {
  //
};

const setPassword = async (userId: string, plainPassword: string) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    isUserExist.password &&
    isUserExist.auths.some((providerObj) => providerObj.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. For changing password you can use change password route.",
    );
  }

  const hashPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  const auths: IAuthProvider[] = [
    ...isUserExist.auths,
    { provider: "credentials", providerId: isUserExist.email },
  ];

  isUserExist.password = hashPassword;
  isUserExist.auths = auths;

  await isUserExist.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  googleCallback,
  resetPassword,
  setPassword,
};

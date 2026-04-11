/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const user = await UserServices.createUser(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User create successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const userData = req.body;
  const token = req.headers.authorization;
  const verifiedToken = verifyToken(
    token as string,
    envVars.JWT_ACCESS_SECRET,
  ) as JwtPayload;

  const newUpdatedUser = await UserServices.updateUser(
    userId as string,
    userData,
    verifiedToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: newUpdatedUser,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully",
    data: users,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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
  const verifiedToken = req.user as JwtPayload;

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

const getMe = catchAsync(async (req, res, next) => {
  const decodedToken = req.user as JwtPayload;
  const user = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrived successfully",
    data: user,
  });
});

const getSingleUser = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const user = await UserServices.getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: user
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  getSingleUser,
};

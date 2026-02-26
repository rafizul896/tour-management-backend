/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const user = await UserServices.createUser(userData);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User create successfully",
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const UserControllers = {
  createUser,
};

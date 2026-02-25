/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    console.log(userData);
    const user = await User.create(userData);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User create successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: err?.message || "Something went wrong!!",
      err,
    });
  }
};

export const UserControllers = {
  createUser,
};

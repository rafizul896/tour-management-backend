/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  const errorSources: any = [];
  let message = err.message || "Something went wrong!";

  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  if (req.files && req.files?.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrls.map((url) => deleteImageFromCloudinary(url)));
  }

  // Mongoose Error
  if (err.code === 11000) {
    const doplicate = err.errmsg.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${doplicate[1]} already exists`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invaild MongoDB ObjectId";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);

    errors.forEach((errObj: any) =>
      errorSources.push({ path: errObj.path, message: errObj.message }),
    );
    message = "Validation Error";
  }
  // Zod Error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "ZodError";

    err.issues.forEach((errObj: any) =>
      errorSources.push({
        path: errObj.path[errObj.path.length - 1],
        message: errObj.message,
      }),
    );
  }
  // App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err?.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message || err?.message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err?.stack : null,
  });

  next();
};

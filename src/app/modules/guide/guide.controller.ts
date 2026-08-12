/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { GuideServices } from "./guide.service";
import { JwtPayload } from "jsonwebtoken";

const applyForGuide = catchAsync(async (req, res, next) => {
  const { userId } = req.user as JwtPayload;

  if (!req.file?.path) {
    throw new AppError(httpStatus.BAD_REQUEST, "NID photo file is required");
  }

  const guideData = {
    user: userId,
    nidPhoto: req.file?.path,
    division: req.body.division,
  };

  const result = await GuideServices.applyForGuide(guideData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Guide application submitted successfully",
    data: result,
  });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const result = await GuideServices.updateApplicationStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Guide application ${String(status).toLowerCase()} successfully`,
    data: result,
  });
});

const getAllGuideApplications = catchAsync(async (req, res) => {
  const result = await GuideServices.getAllGuideApplications(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide applications retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyGuideApplication = catchAsync(async (req, res) => {
  const {userId} = req.user as JwtPayload;
  const result = await GuideServices.getMyGuideApplication(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide application retrieved successfully",
    data: result,
  });
});

const softDeleteGuide = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await GuideServices.softDeleteGuide(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide is deleted successfully",
    data: result,
  });
});

export const GuideControllers = {
  applyForGuide,
  updateApplicationStatus,
  getAllGuideApplications,
  getMyGuideApplication,
  softDeleteGuide,
};

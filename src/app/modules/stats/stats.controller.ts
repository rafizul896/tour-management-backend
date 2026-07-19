/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getBookingStats = catchAsync(async (req, res, next) => {
  const result = await StatsService.getBookingStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking stats fetched successfully",
    data: result,
  });
});

const getPaymentStats = catchAsync(async (req, res, next) => {
  const result = await StatsService.getPaymentStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment stats fetched successfully",
    data: result,
  });
});

const getUserStats = catchAsync(async (req, res, next) => {
  const result = await StatsService.getUserStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User stats fetched successfully",
    data: result,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const result = await StatsService.getTourStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour stats fetched successfully",
    data: result,
  });
});

export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};

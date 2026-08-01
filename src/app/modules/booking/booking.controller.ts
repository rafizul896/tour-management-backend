/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import httpStatus from "http-status-codes";

const createBooking = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { userId } = req.user as JwtPayload;
  const booking = await BookingService.createBooking(userId, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking is created successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await BookingService.getAllBookings(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings are retrieved successfully",
    data: bookings,
  });
});

const getSingleBooking = catchAsync(async (req, res, next) => {
  const bookings = await BookingService.getSingleBooking(
    req.params.bookingId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking is retrieved successfully",
    data: bookings,
  });
});

const getUserBookings = catchAsync(async (req, res, next) => {
  const { userId } = req.user as JwtPayload;
  const bookings = await BookingService.getUserBookings(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings are retrieved successfully",
    data: bookings,
  });
});

const updateBookingStatus = catchAsync(async (req, res, next) => {
  const bookings = await BookingService.updateBookingStatus(
    req.params.bookingId as string,
    req.body.status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Status Updated Successfully",
    data: bookings,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};

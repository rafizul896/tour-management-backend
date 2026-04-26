import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (userId: string, payload: Partial<IBooking>) => {
  const transactionId = getTransactionId();
  const isUserExist = await User.findById(userId);

  if (!isUserExist?.phone || !isUserExist.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update your profile to book a tour ",
    );
  }

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour cost is not found");
  }

  const amount = Number(tour.costFrom) * Number(payload.guestCount);

  const booking = await Booking.create({
    ...payload,
    user: userId,
  });

  const payment = await Payment.create({
    transactionId,
    booking: booking._id,
    status: PAYMENT_STATUS.UNPAID,
    amount,
  });

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { payment: payment._id },
    { new: true, runValidators: true },
  )
    .populate("user", "name email")
    .populate("tour", "title constFrom");

  return updatedBooking;
};

const getAllBookings = async () => {
  //
};

const getSingleBooking = async () => {
  //
};

const getUserBookings = async () => {
  //
};

const updateBookingStatus = async () => {
  //
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};

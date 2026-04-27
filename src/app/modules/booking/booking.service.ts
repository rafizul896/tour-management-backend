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
  const session = await Booking.startSession();
  session.startTransaction();

  try {
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

    const booking = await Booking.create(
      [
        {
          user: userId,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          transactionId,
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email")
      .populate("tour", "title contFrom");

    await session.commitTransaction();
    session.endSession();
    return updatedBooking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllBookings = async () => {
  const bookings = await Booking.find({});

  return bookings;
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

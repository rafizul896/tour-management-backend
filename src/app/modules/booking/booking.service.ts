/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service";
import { getTransactionId } from "../../utils/getTransactionId";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createBooking = async (userId: string, payload: Partial<IBooking>) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
    }

    if (!isUserExist.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
    }

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
      .populate("user", "name email phone address")
      .populate("tour", "title contFrom")
      .populate("payment");

    const user: any = updatedBooking?.user;

    const sslPayload: ISSLCommerz = {
      address: user.address as string,
      phoneNumber: user.phone as string,
      email: user.email as string,
      name: user.name as string,
      amount,
      transactionId,
    };

    const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllBookings = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    Booking.find()
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom images")
      .populate("payment"),
    query,
  );

  const bookings = await queryBuilder
    .filter()
    .fields()
    .sort()
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    data: bookings,
    meta,
  };
};

const getSingleBooking = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom images")
    .populate("payment");

  return booking;
};

const getUserBookings = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const queryBuilder = new QueryBuilder(
    Booking.find({ user: userId })
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom images")
      .populate("payment"),
    query,
  );

  const bookings = await queryBuilder
    .filter()
    .fields()
    .sort()
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    data: bookings,
    meta,
  };
};

const updateBookingStatus = async (id: string, status: BOOKING_STATUS) => {
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (!Object.values(BOOKING_STATUS).includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking status");
  }

  if (booking.status === status) {
    throw new AppError(httpStatus.BAD_REQUEST, `Booking is already ${status}`);
  }

  if (
    [
      BOOKING_STATUS.COMPLETE,
      BOOKING_STATUS.CANCEL,
      BOOKING_STATUS.FAILED,
    ].includes(booking.status)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status of a ${booking.status} booking`,
    );
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment");

  return updatedBooking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};

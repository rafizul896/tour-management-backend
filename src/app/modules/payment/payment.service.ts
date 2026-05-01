/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  const payment = await Payment.findOne({ booking: bookingId });

  if (!booking) {
    throw new AppError(404, "Booking is not Found!");
  }


  if (!payment) {
    throw new AppError(404, "Payment is not Found!");
  }

  const user: any = booking?.user;

  const sslPayload: ISSLCommerz = {
    address: user.address as string,
    phoneNumber: user.phone as string,
    email: user.email as string,
    name: user.name as string,
    amount: payment?.amount,
    transactionId: payment?.transactionId,
  };

  const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment is Completed Successfully",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

const failPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.FAILED,
      },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment is Failed",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

const cancelPayment = async (tran_id: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: tran_id },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      {
        _id: updatedPayment?.booking,
      },
      {
        status: BOOKING_STATUS.CANCEL,
      },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment is Cancelled",
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
